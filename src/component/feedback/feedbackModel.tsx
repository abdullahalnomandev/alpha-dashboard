import { Form, Input, Modal, InputNumber } from "antd";
import { useEffect } from "react";

export const FeedbackModel: React.FC<{
  open: boolean;
  loading: boolean;
  editFeedback: {
    _id: string;
    partner: {
      _id: string;
      name: string;
      email: string;
    };
    rating: number;
    comment: string;
  } | null;
  onClose: () => void;
  onAdd: (formData: { partnerId: string; rating: number; comment: string }) => Promise<void>;
  onUpdate: (
    id: string,
    formData: { partnerId: string; rating: number; comment: string }
  ) => Promise<void>;
}> = ({ open, loading, editFeedback, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editFeedback) {
      form.setFieldsValue({
        partnerId: editFeedback.partner?._id,
        partnerName: editFeedback.partner?.name,
        partnerEmail: editFeedback.partner?.email,
        rating: editFeedback.rating,
        comment: editFeedback.comment,
      });
    } else {
      form.resetFields();
    }
  }, [editFeedback, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      partnerId: values.partnerId,
      rating: values.rating,
      comment: values.comment || "",
    };

    if (editFeedback) {
      await onUpdate(editFeedback._id, payload);
    } else {
      await onAdd(payload);
    }

    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={editFeedback ? "Edit Feedback" : "Add Feedback"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editFeedback ? "Update" : "Create"}
      width={500}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Partner Name"
          name="partnerName"
          rules={[{ required: true, message: "Please enter partner name" }]}
        >
          <Input placeholder="Partner name" />
        </Form.Item>

        <Form.Item
          label="Partner Email"
          name="partnerEmail"
          rules={[
            { required: true, message: "Please enter partner email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Partner email" />
        </Form.Item>

        <Form.Item
          label="Rating"
          name="rating"
          rules={[{ required: true, message: "Please enter rating (1-5)" }]}
        >
          <InputNumber min={1} max={5} style={{ width: "100%" }} placeholder="Rating 1-5" />
        </Form.Item>

        <Form.Item label="Comment" name="comment" required={false}>
          <Input.TextArea placeholder="Enter comment" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};