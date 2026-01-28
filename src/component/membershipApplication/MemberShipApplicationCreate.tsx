import { Form, Modal, DatePicker, Input, Select, Button, Space } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import type { MembershipApplicationType, FamilyMember } from ".";
import dayjs from "dayjs";
import { useGetMembershipPlansQuery } from "../../redux/apiSlices/membershipPlanSlice";

const { Option } = Select;

const FAMILY_RELATION_OPTIONS = [
  { value: "parent", label: "Parent" },
  { value: "sibling", label: "Sibling" },
  { value: "grandparent", label: "Grandparent" },
  { value: "grandchild", label: "Grandchild" },
  { value: "in_law", label: "In Law" },
  { value: "guardian", label: "Guardian" },
  { value: "partner", label: "Partner" },
  { value: "other", label: "Other" },
];

function formatType(val: string) {
  if (!val) return "";
  return val
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}

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
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMembershipType, setSelectedMembershipType] = useState<string | undefined>(undefined);
  const [familyMembersEnabled, setFamilyMembersEnabled] = useState<boolean>(false);
  const { data: membershipPlansResponse } = useGetMembershipPlansQuery({});

  // Build membership type options from API data
  const membershipTypeOptions = useMemo(() => {
    if (membershipPlansResponse && Array.isArray(membershipPlansResponse.data)) {
      return membershipPlansResponse.data.map((plan: any) => ({
        value: plan.membershipType,
        label: formatType(plan.membershipType)
      }));
    }
    return [];
  }, [membershipPlansResponse]);

  const checkFamilyEnabled = useCallback((membershipTypeValue?: string) => {
    if (!membershipPlansResponse || !membershipPlansResponse.data) return false;
    const plans = membershipPlansResponse.data as any[];
    const found = plans.find(plan => plan.membershipType === membershipTypeValue);
    return !!(
      found &&
      found.familyMembershipOptions &&
      found.familyMembershipOptions.enableFamilyMembers
    );
  }, [membershipPlansResponse]);

  useEffect(() => {
    let newSelectedType: string | undefined;
    if (editApplication) {
      form.setFieldsValue({
        // address intentionally omitted based on instruction
        membershipType: editApplication.membershipType,
        expireId: editApplication.expireId ? dayjs(editApplication.expireId) : null,
        from: editApplication.from,
      });
      setFamilyMembers(editApplication.familyMembers || []);
      newSelectedType = editApplication.membershipType;
    } else {
      form.resetFields();
      setFamilyMembers([]);
      if (membershipTypeOptions.length > 0) {
        newSelectedType = membershipTypeOptions[0].value;
        form.setFieldsValue({
          membershipType: newSelectedType,
        });
      }
    }
    setSelectedMembershipType(newSelectedType);
    // eslint-disable-next-line
  }, [editApplication, form, membershipTypeOptions]);

  useEffect(() => {
    setFamilyMembersEnabled(
      checkFamilyEnabled(selectedMembershipType)
    );
  }, [selectedMembershipType, checkFamilyEnabled]);

  const handleMembershipTypeChange = (value: string) => {
    setSelectedMembershipType(value);
    // Reset family members if family membership disables
    if (!checkFamilyEnabled(value)) {
      setFamilyMembers([]);
    }
    form.setFieldsValue({ membershipType: value });
  };

  const addFamilyMember = () => {
    setFamilyMembers((m) => [...m, { name: "", email: "", relation: "" }]);
  };
  const updateFamilyMember = (idx: number, field: string, value: string) => {
    setFamilyMembers((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], [field]: value };
      return clone;
    });
  };
  const removeFamilyMember = (idx: number) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (values.expireId) {
      values.expireId = values.expireId.toISOString();
    }
    values.familyMembers = familyMembersEnabled
      ? familyMembers.filter(fm => fm.name && fm.relation)
      : [];

    // Remove profileImage logic

    delete values.memberShipId;
    delete values.membershipStatus;
    // Remove address from update payload as well
    delete values.address;

    if (editApplication) {
      await onUpdate(editApplication._id, values);
    } else {
      await onAdd(values);
    }
    form.resetFields();
    setFamilyMembers([]);
  };

  return (
    <>
      <Modal
        open={open}
        title={editApplication ? "Edit Membership Application" : "Add Membership Application"}
        onCancel={onClose}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={editApplication ? "Update" : "Create"}
        width={600}
        destroyOnClose
      >
        {/* --- Main Form fields --- */}
        <Form form={form} layout="vertical">
          {/* Membership ID and Status removed */}
          <Form.Item
            label="Membership Type"
            name="membershipType"
            rules={[{ required: true, message: "Please select membership type" }]}
          >
            <Select
              placeholder="Select membership type"
              loading={!membershipTypeOptions.length}
              onChange={handleMembershipTypeChange}
              value={selectedMembershipType}
            >
              {membershipTypeOptions.map((option: { value: string }) => (
                <Option key={option.value} value={option.value}>
                  {formatType(option.value)}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Name field removed as per instruction */}
          {/* Address field is now omitted from the form for update */}
          {!editApplication && (
            <Form.Item
              label="Address"
              name="address"
            >
              <Input placeholder="Address" />
            </Form.Item>
          )}
          <Form.Item
            label="Expiry Date"
            name="expireId"
            rules={[{ required: true, message: "Please select expiry date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={false}
              format="YYYY-MM-DD"
              disabledDate={current => current && current < dayjs().startOf('day')}
              placeholder="Select expiry date"
            />
          </Form.Item>
          {/* Family Members */}
          {familyMembersEnabled && (
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>Family Members (optional):</div>
              {familyMembers.map((fm, idx) => (
                <Space align="start" style={{ display: "flex", marginBottom: 8 }} key={idx}>
                  <Input
                    placeholder="Name"
                    value={fm.name}
                    style={{ minWidth: 120 }}
                    onChange={e => updateFamilyMember(idx, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    value={fm.email}
                    style={{ minWidth: 150 }}
                    onChange={e => updateFamilyMember(idx, "email", e.target.value)}
                  />
                  <Select
                    placeholder="Relation"
                    value={fm.relation}
                    style={{ minWidth: 120 }}
                    onChange={value => updateFamilyMember(idx, "relation", value)}
                  >
                    {FAMILY_RELATION_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                  <Button danger type="link" onClick={() => removeFamilyMember(idx)} style={{ color: "#f5222d" }}>
                    Remove
                  </Button>
                </Space>
              ))}
              <Button
                type="dashed"
                style={{ marginTop: 6 }}
                onClick={addFamilyMember}
                block
              >
                + Add Family Member
              </Button>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};