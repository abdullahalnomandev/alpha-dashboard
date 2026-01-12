import { Form, Input, Modal, message } from "antd";
import { useEffect } from "react";

/**
 * Modal for Add/Edit Offer Category ("Category") - not sponsor
 */
export const OfferCategoryModal: React.FC<{
  open: boolean;
  loading: boolean;
  editSponsor: {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  onClose: () => void;
  onAdd: (formData: { name: string }) => Promise<void>;
  onUpdate: (id: string, formData: { name: string }) => Promise<void>;
}> = ({ open, loading, editSponsor, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();

  // Populate form fields on edit
  useEffect(() => {
    if (editSponsor && editSponsor.name) {
      form.setFieldsValue({
        name: editSponsor.name || "",
      });
    } else {
      form.resetFields();
    }
  }, [editSponsor, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editSponsor) {
        await onUpdate(editSponsor._id, { name: values.name });
        form.resetFields();
      } else {
        await onAdd({ name: values.name });
        form.resetFields();
      }
    } catch (e: any) {
      // Ant Design form validation errors are displayed inline, skip toast
      if (e && e.errorFields) {
        return;
      }

      // Handle DB/API errors with detail
      // Common RTK Query shape: e.data.message or e.message
      let dbErrorMsg =
        (e && e.data && (e.data.message || e.data.error)) ||
        (e && e.message) ||
        undefined;

      if (dbErrorMsg && typeof dbErrorMsg === "string") {
        message.error(dbErrorMsg);
      } else {
        message.error("An error occurred. Please check your input and try again.");
      }
    }
  };

  return (
    <Modal
      open={open}
      title={editSponsor ? "Edit Category" : "Add Category"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editSponsor ? "Update" : "Create"}
      width={400}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: editSponsor?.name || "",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter category name" }]}
        >
          <Input placeholder="Category Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
