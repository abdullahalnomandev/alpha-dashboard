import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import type { UserType } from ".";

export const UserModel: React.FC<{
  open: boolean;
  loading: boolean;
  editUser: UserType | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}> = ({ open, loading, editUser, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editUser) {
      form.setFieldsValue({
        name: editUser.name,
        email: editUser.email,
        phone: editUser.phone,
        role: editUser.role,
        status: editUser.status,
      });
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line
  }, [editUser, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key] != null) formData.append(key, values[key]);
    });

    if (editUser) {
      await onUpdate(editUser._id, formData);
    } else {
      await onAdd(formData);
    }
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={editUser ? "Edit User" : "Add User"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editUser ? "Update" : "Create"}
      width={480}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter phone number" },
            { pattern: /^\+?[0-9\- ()]{7,20}$/, message: "Enter a valid phone" }
          ]}
        >
          <Input placeholder="Phone number" />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="moderator">Moderator</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};