import { Button, Form, Input, Modal, Upload } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

export const MemberShipFetureModal: React.FC<{
  open: boolean;
  loading: boolean;
  editClub: {
    _id: string;
    title: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  } | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}> = ({ open, loading, editClub, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (editClub) {
      form.setFieldsValue({
        title: editClub.title,
        description: editClub.description || "",
      });
      setFileList([]);
    } else {
      setFileList([]);
      form.resetFields();
    }
  }, [editClub, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();

    // Only include necessary fields for Membership Feature
    if (values.title) {
      formData.append("title", values.title);
    }
    if (typeof values.description === "string" && values.description.trim()) {
      formData.append("description", values.description.trim());
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
  };

  return (
    <Modal
      open={open}
      title={editClub ? "Edit Feature" : "Add Feature"}
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
          rules={[{ required: true, message: "Please enter feature title" }]}
        >
          <Input placeholder="Feature title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          required={false}
          style={{ marginBottom: 24 }}
        >
          <Input.TextArea
            rows={5}
            placeholder="Write feature description"
            maxLength={1000}
          />
        </Form.Item>
        <Form.Item label="Icon">
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
            <Button icon={<UploadOutlined />}>Select Icon</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
