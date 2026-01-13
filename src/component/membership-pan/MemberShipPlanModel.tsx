import { Form, Input, Modal, Upload, Switch, InputNumber, Select, Space, Card, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";
import { useGetMembershipFeaturesQuery } from "../../redux/apiSlices/membershipFeatureSlice";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

interface MembershipFeature {
  _id: string;
  icon: string;
  title: string;
  description: string;
}

interface MembershipPlan {
  membershipType: string;
  image: string;
  title: string;
  description: string;
  subDescription: string;
  features: MembershipFeature[];
  familyMembershipOptions: {
    enableFamilyMembers: boolean;
    familyMembershipLimit?: number;
  };
}

interface MemberShipPlanModelProps {
  open: boolean;
  loading: boolean;
  editPlan: MembershipPlan | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}

export const MemberShipPlanModel: React.FC<MemberShipPlanModelProps> = ({
  open,
  loading,
  editPlan,
  onClose,
  onAdd,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const { data: featuresData, isLoading: featuresLoading } = useGetMembershipFeaturesQuery({});

  // Controlled state for familyMembers
  // We'll use form.getFieldValue to keep always synced to form's value
  useEffect(() => {
    if (editPlan) {
      form.setFieldsValue({
        membershipType: editPlan.membershipType,
        title: editPlan.title,
        description: editPlan.description,
        subDescription: editPlan.subDescription,
        enableFamilyMembers: editPlan.familyMembershipOptions?.enableFamilyMembers ?? false,
        familyMembershipLimit:
          editPlan.familyMembershipOptions?.enableFamilyMembers
            ? editPlan.familyMembershipOptions?.familyMembershipLimit
            : undefined,
      });
      setSelectedFeatures(editPlan.features?.map((f) => f._id) || []);
      if (editPlan.image) {
        setFileList([]);
      }
    } else {
      form.resetFields();
      setFileList([]);
      setSelectedFeatures([]);
    }
  }, [editPlan, form]);

  // Watch value for family membership fields to ensure correct toggling/validation
  const enableFamilyMembers = Form.useWatch("enableFamilyMembers", form);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();

    // Basic fields
    formData.append("membershipType", values.membershipType);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("subDescription", values.subDescription);

    // Family options
    // Always build new object, don't rely on values if unchecked (avoid sending old limit)
    const familyMembershipOptions: Record<string, any> = {};
    familyMembershipOptions.enableFamilyMembers = !!values.enableFamilyMembers;
    // Only include limit if enabled and has value
    if (!!values.enableFamilyMembers && values.familyMembershipLimit != null) {
      familyMembershipOptions.familyMembershipLimit = values.familyMembershipLimit;
    }
    formData.append("familyMembershipOptions", JSON.stringify(familyMembershipOptions));

    // Features
    if (selectedFeatures.length > 0) {
      selectedFeatures.forEach((featureId) => {
        formData.append("features[]", featureId);
      });
    }

    // Logo image
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    try {
      if (editPlan) {
        await onUpdate(editPlan.membershipType, formData);
      } else {
        await onAdd(formData);
      }
    } catch (error: any) {
      // Try to extract message from Ant Design error structure or default
      const msg =
        (error && error.data && (error.data.message || error.data.error)) ||
        error.message ||
        "Something went wrong. Please try again.";
      // Use Ant Design message.error if available in this component
      if (typeof message !== "undefined" && typeof message.error === "function") {
        message.error(msg);
      } else {
        alert(msg);
      }
      return; // Prevent resetFields when error
    }

    form.resetFields();
    setFileList([]);
    setSelectedFeatures([]);
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>{editPlan ? "Edit Membership Plan" : "Add Membership Plan"}</span>
        </div>
      }
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editPlan ? "Update Plan" : "Create Plan"}
      width={700}
      destroyOnClose
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        {/* Membership Type */}
        <Form.Item
          label={<Text strong>Membership Type</Text>}
          name="membershipType"
          rules={[
            { required: true, message: "Please enter membership type" },
            {
              pattern: /^[a-zA-Z_]+$/,
              message:
                "Only letters and underscores are allowed. Spaces, numbers, and special characters are not permitted.",
            },
          ]}
        >
          <Input
            placeholder="e.g., alpha_family, beta, premium"
            size="large"
            maxLength={32}
          />
        </Form.Item>

        {/* Title */}
        <Form.Item
          label={<Text strong>Plan Title</Text>}
          name="title"
          rules={[{ required: true, message: "Please enter plan title" }]}
        >
          <Input placeholder="e.g., Regular Membership" size="large" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label={<Text strong>Description</Text>}
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea
            placeholder="e.g., All essential features for individual professionals"
            rows={2}
            maxLength={200}
            showCount
          />
        </Form.Item>

        {/* Sub Description */}
        <Form.Item
          label={<Text strong>Detailed Description</Text>}
          name="subDescription"
          rules={[{ required: true, message: "Please enter detailed description" }]}
        >
          <TextArea
            placeholder="Provide more details about this membership plan..."
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* Logo Upload */}
        <Form.Item label={<Text strong>Plan Logo/Icon</Text>}>
          <Upload
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                Modal.error({
                  title: "Invalid file type",
                  content: "Only image files are supported",
                });
              }
              return false;
            }}
            accept="image/*"
            fileList={
              fileList.length
                ? fileList
                : editPlan?.image
                ? [
                    {
                      uid: "-1",
                      name: editPlan.image.split("/").pop() || "logo.png",
                      status: "done",
                      url: imageUrl + editPlan.image,
                    },
                  ]
                : []
            }
            onChange={(info) => {
              setFileList(info.fileList.slice(-1));
            }}
            listType="picture-card"
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Logo</div>
            </div>
          </Upload>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Recommended: 200x200px, PNG or JPG
          </Text>
        </Form.Item>

        {/* Features Selection */}
        <Form.Item label={<Text strong>Included Features</Text>} required>
          <Select
            mode="multiple"
            placeholder="Select features to include in this plan"
            value={selectedFeatures}
            onChange={setSelectedFeatures}
            size="large"
            loading={featuresLoading}
            style={{ width: "100%" }}
            optionFilterProp="children"
          >
            {featuresData?.data?.map((feature: MembershipFeature) => (
              <Option key={feature._id} value={feature._id}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{feature.title}</span>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    - {feature.description}
                  </Text>
                </div>
              </Option>
            ))}
          </Select>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Selected {selectedFeatures.length} feature(s)
          </Text>
        </Form.Item>

        {/* Family Membership Options */}
        <Card
          title={<Text strong>Family Membership Options</Text>}
          size="small"
          style={{ marginBottom: 0 }}
        >
          {/* Use checked and onChange only for UI indicator, don't manage by state, let form control */}
          <Form.Item
            name="enableFamilyMembers"
            valuePropName="checked"
            style={{ marginBottom: 16 }}
          >
            <Space>
              <Switch
                checked={!!enableFamilyMembers}
                onChange={(checked) => {
                  form.setFieldsValue({ enableFamilyMembers: checked });
                  if (!checked) {
                    // clear limit if toggling off
                    form.setFieldsValue({ familyMembershipLimit: undefined });
                  }
                }}
              />
              <Text>Enable family members</Text>
            </Space>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) =>
              prev.enableFamilyMembers !== curr.enableFamilyMembers
            }
          >
            {() =>
              form.getFieldValue("enableFamilyMembers") ? (
                <Form.Item
                  label={<Text>Maximum Family Members</Text>}
                  name="familyMembershipLimit"
                  rules={[
                    { required: true, message: "Please enter limit" },
                    {
                      type: "number",
                      min: 1,
                      max: 20,
                      message: "Limit must be between 1-20",
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    placeholder="e.g., 5"
                    min={1}
                    max={20}
                    style={{ width: "100%" }}
                    size="large"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};