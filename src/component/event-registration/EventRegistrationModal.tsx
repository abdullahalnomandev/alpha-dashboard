import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

export const EventRegistrationModal: React.FC<{
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; contact: string; email: string; message: string }) => Promise<void>;
}> = ({ open, loading, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Contact Us"
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Submit"
      width={500}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Your name" />
        </Form.Item>
        <Form.Item
          label="Contact"
          name="contact"
          rules={[{ required: true, message: "Please enter your contact (phone)" }]}
        >
          <Input placeholder="Contact/Phone" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" }
          ]}
        >
          <Input placeholder="Your email" />
        </Form.Item>
        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: "Please enter your message" }]}
        >
          <Input.TextArea placeholder="Your message" rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
