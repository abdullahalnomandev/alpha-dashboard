import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import Editor from "react-simple-wysiwyg";

// FAQ Modal for Add/Edit FAQ
export const FaqModel: React.FC<{
  open: boolean;
  loading: boolean;
  // Only _id, title, description, createdAt, updatedAt
  editClub: {
    _id: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  onClose: () => void;
  onAdd: (data: { title: string; description: string }) => Promise<void>;
  onUpdate: (id: string, data: { title: string; description: string }) => Promise<void>;
}> = ({ open, loading, editClub, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (editClub) {
      form.setFieldsValue({
        title: editClub.title,
      });
      setHtml(editClub.description || "");
    } else {
      form.resetFields();
      setHtml("");
    }
    // eslint-disable-next-line
  }, [editClub, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const data = {
      title: values.title,
      description: html?.trim() || ""
    };

    if (editClub) {
      await onUpdate(editClub._id, data);
    } else {
      await onAdd(data);
    }

    form.resetFields();
    setHtml("");
  };

  return (
    <Modal
      open={open}
      title={editClub ? "Edit FAQ" : "Add FAQ"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editClub ? "Update" : "Create"}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Question Title"
          name="title"
          rules={[{ required: true, message: "Please enter FAQ question" }]}
        >
          <Input placeholder="FAQ question" />
        </Form.Item>
        <Form.Item
          label="Answer"
          required={false}
          style={{ marginBottom: 24 }}
        >
          <Editor
            value={html}
            onChange={e => setHtml(e.target.value)}
            aria-multiline
            style={{ minHeight: 150, height: 150 }}
            placeholder="Write answer"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
