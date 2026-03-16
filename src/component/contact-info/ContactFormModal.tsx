import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

export type ContactFormValues = {
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
};

export const ContactFormModal: React.FC<{
  open: boolean;
  loading: boolean;
  data?: ContactFormValues | null;
  onClose: () => void;
  onSubmit: (values: ContactFormValues) => Promise<void>;
}> = ({ open, loading, data, onClose, onSubmit }) => {
  const [form] = Form.useForm<ContactFormValues>();

  // Populate form when editing or reset on close
  useEffect(() => {
    if (open && data) {
      form.setFieldsValue(data);
    } else if (!open) {
      form.resetFields();
    }
  }, [open, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (err: any) {
      // Form validation errors are shown inline automatically
      // message.error("Please check the form fields and try again.");
    }
  };

  return (
    <Modal
      open={open}
      title={data ? "Edit Contact" : "Add Contact"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={data ? "Update" : "Submit"}
      width={600}
      destroyOnHidden 
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item label="Role" name="title" rules={[{ required: true, message: "Please enter role" }]}>
          <Input placeholder="Role/Title" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Phone number" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter valid email" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Location" name="location" rules={[{ required: true, message: "Please enter location" }]}>
          <Input placeholder="Location" />
        </Form.Item>
      </Form>
    </Modal>
  );
};