import { Form, Input, Modal, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";
import { imageUrl } from "../../redux/api/baseApi";

type EditClub = {
  _id: string;
  title?: string;
  description?: string;
  image?: string;
};

export const ContactUsModal: React.FC<{
  open: boolean;
  loading: boolean;
  editClub: EditClub | null;
  onClose: () => void;
  onAdd: (data: FormData) => Promise<void>;
  onUpdate: (id: string, data: FormData) => Promise<void>;
}> = ({ open, loading, editClub, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [html, setHtml] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editClub) {
      form.setFieldsValue({ title: editClub.title || "" });
      setHtml(editClub.description || "");
      setImage(null);

      if (editClub.image) {
        setPreviewUrl(
          editClub.image.startsWith("http")
            ? editClub.image
            : `${imageUrl}${editClub.image}`
        );
      }
    } else {
      form.resetFields();
      setHtml("");
      setImage(null);
      setPreviewUrl(null);
    }
  }, [editClub, form]);

  const beforeUpload = (file: File) => {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const removeImage = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    // Fetch ALL form values, not only registered ones
    const values = form.getFieldsValue(true);
    await form.validateFields();

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", html.trim());

    if (image) {
      formData.append("image", image);
    }
    console.log({values})

    if (editClub) {
      await onUpdate(editClub._id, formData);
    } else {
      await onAdd(formData);
    }

    removeImage();
    form.resetFields();
    setHtml("");
  };

  return (
    <Modal
      open={open}
      title={editClub ? "Edit Contact Info" : "Add Contact Info"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editClub ? "Update" : "Create"}
      width={600}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Contact title" />
        </Form.Item>

        <Form.Item label="Description">
          <Editor
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            style={{ minHeight: 150 }}
          />
        </Form.Item>

        <Form.Item label="Image (optional)">
          <Upload.Dragger
            accept="image/*"
            maxCount={1}
            beforeUpload={beforeUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>
              {previewUrl ? "Change Image" : "Upload Image"}
            </Button>
          </Upload.Dragger>

          {previewUrl && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center" }}>
              <img
                src={previewUrl}
                alt="preview"
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
              <Button type="link" danger onClick={removeImage}>
                Remove
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};
