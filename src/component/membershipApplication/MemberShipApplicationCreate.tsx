import { Form, Modal, DatePicker } from "antd";
import { useEffect } from "react";
import type { MembershipApplicationType } from ".";
import dayjs from "dayjs";


export const MemberShipApplicationCreate: React.FC<{
  open: boolean;
  loading: boolean;
  editApplication: MembershipApplicationType | null;
  onClose: () => void;
  onAdd: (values: any) => Promise<void>;
  onUpdate: (id: string, values: any) => Promise<void>;
}> = ({
  open,
  loading,
  editApplication,
  onClose,
  onAdd,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editApplication) {
      form.setFieldsValue({
        // only expireId, to keep only the expire date editable
        expireId: editApplication.expireId ? dayjs(editApplication.expireId) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editApplication, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    // Convert expireId to ISO string if present
    if (values.expireId) {
      values.expireId = values.expireId.toISOString();
    }
    if (editApplication) {
      await onUpdate(editApplication._id, values);
    } else {
      await onAdd(values);
    }
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={editApplication ? "Edit Expiry Date" : "Set Expiry Date"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editApplication ? "Update" : "Create"}
      width={400}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Expiry Date"
          name="expireId"
          rules={[
            { required: true, message: "Please select expiry date" }
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            showTime={false}
            format="YYYY-MM-DD"
            disabledDate={current => current && current < dayjs().startOf('day')}
            placeholder="Select expiry date"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};