import { Button, Form, Input, Modal, Upload, Select } from "antd";
import { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";
import { useGetClubsQuery } from "../../redux/apiSlices/clubSlice";

// StoryModal: reused logic/structure from ClubModel (but for stories)
export const StoryModal: React.FC<{
  open: boolean;
  loading: boolean;
  editClub: {
    _id: string;
    name: string;
    club?: { _id: string; name: string }; // club for story
    image?: string;
    description?: string;
  } | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}> = ({ open, loading, editClub, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [html, setHtml] = useState<string>("");

  // Club select options from api
  const { data: clubsData, isLoading: isClubsLoading } = useGetClubsQuery({ query: { page: 1, limit: 100 } });

  useEffect(() => {
    if (editClub) {
      form.setFieldsValue({
        title: editClub.name,
        club: editClub.club?._id || undefined,
      });
      setHtml(editClub.description || "");
      setFileList([]);
    } else {
      setFileList([]);
      form.resetFields();
      setHtml("");
    }
    // eslint-disable-next-line
  }, [editClub, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();

    // For Story, include title, club, description, image
    if (values.title) formData.append("title", values.title);
    if (values.club) formData.append("club", values.club);
    if (html && html.trim()) {
      formData.append("description", html);
    } else {
      formData.append("description", "");
    }
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    if (editClub) {
      await onUpdate(editClub._id, formData);
    } else {
      await onAdd(formData);
    }
    form.resetFields();
    setFileList([]);
    setHtml("");
  };

  return (
    <Modal
      open={open}
      title={editClub ? "Edit Story" : "Add Story"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editClub ? "Update" : "Create"}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter story title" }]}
        >
          <Input placeholder="Story title" />
        </Form.Item>
        <Form.Item
          label="Club"
          name="club"
          rules={[{ required: true, message: "Please select the club" }]}
        >
          <Select
            placeholder="Select club"
            loading={isClubsLoading}
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {(clubsData?.data || []).map((club: any) => (
              <Select.Option key={club._id} value={club._id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Description"
          required={false}
          style={{ marginBottom: 24 }}
        >
          <Editor
            value={html}
            onChange={e => setHtml(e.target.value)}
            aria-multiline
            style={{ minHeight: 150, height: 150 }}
            placeholder="Write story description"
          />
        </Form.Item>
        <Form.Item label="Image">
          <Upload
            beforeUpload={file => {
              const isJpgOrPng =
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/jpg";
              if (!isJpgOrPng) {
                Modal.error({
                  title: "Invalid file type",
                  content: "Only .jpeg, .png, .jpg file supported",
                });
              }
              return false;
            }}
            accept=".jpeg,.jpg,.png"
            fileList={
              fileList.length
                ? fileList
                : editClub?.image
                ? [
                    {
                      uid: "-1",
                      name:
                        editClub.image.split("/").pop() ||
                        "image.png",
                      status: "done",
                      url:
                        editClub.image.startsWith("http")
                          ? editClub.image
                          : imageUrl + editClub.image,
                    },
                  ]
                : []
            }
            onChange={info => {
              setFileList(info.fileList.slice(-1));
            }}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
