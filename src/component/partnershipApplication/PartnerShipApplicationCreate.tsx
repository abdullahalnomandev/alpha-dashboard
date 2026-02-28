import { Form, Modal, Input } from "antd";
import { useEffect } from "react";
import type { PartnerShipApplicationType } from ".";
import { message } from "antd";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
export const PartnerShipApplicationCreate: React.FC<{
  open: boolean;
  loading: boolean;
  editApplication: PartnerShipApplicationType | null;
  onClose: () => void;
  onAdd: (values: any) => Promise<void>;
  onUpdate: (id: string, values: any) => Promise<void>;
}> = ({ open, loading, editApplication, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editApplication) {
      form.setFieldsValue({
        companyName: editApplication.companyName,
        industry: editApplication.industry,
        contactName: editApplication.contactName,
        contactEmail: editApplication.contactEmail,
        contactPhone: editApplication.contactPhone,
        website: editApplication.website,
        message: editApplication.message,
        partnerShipStatus: editApplication.partnerShipStatus,
      });
    } else {
      form.resetFields();
    }
  }, [editApplication, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Remove fields that should not be sent
      delete values.partnerShipStatus;

      if (editApplication) {
        await onUpdate(editApplication._id, values);
        message.success("PartnerShip application updated");
      } else {
        await onAdd(values);
        message.success("PartnerShip application created");
      }

      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      open={open}
      title={editApplication ? "Edit PartnerShip Application" : "Add PartnerShip Application"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editApplication ? "Update" : "Create"}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input placeholder="Company Name" />
        </Form.Item>

        <Form.Item
          label="Industry"
          name="industry"
          rules={[{ required: true, message: "Please enter industry" }]}
        >
          <Input placeholder="Industry" />
        </Form.Item>

        <Form.Item
          label="Contact Name"
          name="contactName"
          rules={[{ required: true, message: "Please enter contact name" }]}
        >
          <Input placeholder="Contact Name" />
        </Form.Item>

        {
          !editApplication && <>
            <Form.Item
              label="Contact Email"
              name="contactEmail"
              rules={[{ required: true, message: "Please enter contact email" }, { type: "email", message: "Invalid email" }]}
            >
              <Input placeholder="Contact Email" />
            </Form.Item>

            <Form.Item
              label="Contact Phone"
              name="contactPhone"
              rules={[{ required: true, message: "Please enter contact phone" }]}
            >
              {/* <Input placeholder="Contact Phone" /> */}
              <PhoneInput
                defaultCountry="ae"
                placeholder="Enter spouse phone"
                style={{
                  width: "100%",
                  borderRadius: "0.375rem", // equivalent to rounded-md
                  height: "2.5rem", // 10 * 0.25rem
                  border: "none",
                  padding: "0 0.5rem", // optional for inner spacing
                }}
              />
            </Form.Item>
          </>

        }



        <Form.Item label="Website" name="website" rules={[{ required: true, type: "url", message: "Please enter website" }]}>
          <Input placeholder="Website " />
        </Form.Item>

        <Form.Item label="Message" name="message" rules={[{ required: true, message: "Please enter message" }]}>
          <Input.TextArea placeholder="Message" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};