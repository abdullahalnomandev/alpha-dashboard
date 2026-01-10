import { Button, Form, Input, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

export const ClubModel: React.FC<{
  open: boolean;
  loading: boolean;
  editClub: {
    _id: string;
    name: string;
    location?: string;
    image?: string;
    limitOfMember?: number;
    numberOfMembers?: number;
    description?: string;
  } | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}> = ({ open, loading, editClub, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (editClub) {
      form.setFieldsValue({
        name: editClub.name,
        limitOfMember: editClub.limitOfMember,
        location: editClub.location || ""
      });
      setHtml(editClub.description || "");
      // Set image file list for preview
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

    // Only include necessary fields for Club
    for (const k of Object.keys(values)) {
      if (k === "limitOfMember") {
        formData.append("limitOfMember", String(values[k]));
      } else if (values[k]) {
        formData.append(k, values[k]);
      }
    }
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
      title={editClub ? "Edit Club" : "Add Club"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editClub ? "Update" : "Create"}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter club name" }]}
        >
          <Input placeholder="Club name" />
        </Form.Item>
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter club location" }]}
        >
          <Input placeholder="Location" />
        </Form.Item>
        <Form.Item
          label="Member"
          name="limitOfMember"
          rules={[{ required: true, message: "Please set the member" }]}
        >
          <Input type="number" min={1} placeholder="Number of members" />
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
            placeholder="Write club description"
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
