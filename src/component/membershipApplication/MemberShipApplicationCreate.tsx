
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Checkbox,
  Button,
  Upload,
  Row,
  Col,
  InputNumber,
  Radio,
} from "antd";
import { useEffect, useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { BsUpload } from "react-icons/bs";
import { useGetMembershipPlansQuery } from "../../redux/apiSlices/membershipPlanSlice";

interface Props {
  open: boolean;
  loading: boolean;
  editApplication: any | null;
  onClose: () => void;
  onAdd: (values: FormData) => Promise<void>;
  onUpdate: (id: string, values: FormData) => Promise<void>;
}
const benefitsInterests = [
  { value: "networking", label: "Social Networking Events" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "family", label: "Family & Leisure Activities" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "automotive", label: "Automotive & Motorsport" },
  { value: "lifestyle", label: "Lifestyle & Wellness" },
];


export const MemberShipApplicationCreate: React.FC<Props> = ({
  open,
  loading,
  editApplication,
  onClose,
  onAdd,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  const [profileFile, setProfileFile] = useState<UploadFile[]>([]);
  const [emiratesFiles, setEmiratesFiles] = useState<UploadFile[]>([]);
  const [passportFiles, setPassportFiles] = useState<UploadFile[]>([]);
  const [phone, setPhone] = useState("");
  const [spousePhone, setSpousePhone] = useState("");

  // File uploads with preview
  const [profileImageFile, setProfileImageFile] = useState<UploadFile[]>([]);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const { data: membershipData } = useGetMembershipPlansQuery({});

  /* ---------------- Prefill Edit ---------------- */
  useEffect(() => {
    if (editApplication) {
      form.setFieldsValue({
        ...editApplication,
        dateOfBirth: editApplication.dateOfBirth
          ? dayjs(editApplication.dateOfBirth)
          : null,
        expireId: editApplication.expireId
          ? dayjs(editApplication.expireId)
          : null,
      });

      setPhone(editApplication.phone || "");
      setSpousePhone(editApplication?.family?.spouse?.phone || "");
    } else {
      form.resetFields();
      setPhone("");
      setSpousePhone("");
      setProfileFile([]);
      setEmiratesFiles([]);
      setPassportFiles([]);
    }
  }, [editApplication]);

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (!["family", "benefitsAndLifestyleInterests"].includes(key)) {
        const val = values[key];

        if (dayjs.isDayjs(val)) {
          formData.append(key, val.toISOString());
        } else if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      }
    });

    formData.append("phone", phone);

    // Benefits
    values.benefitsAndLifestyleInterests?.forEach((item: string) =>
      formData.append("benefitsAndLifestyleInterests", item)
    );

    // Family
    if (values.family) {
      formData.append("family", JSON.stringify(values.family));
      formData.append("spousePhone", spousePhone);
    }

    // Files
    if (profileFile[0])
      formData.append("profileImage", profileFile[0] as any);

    emiratesFiles.forEach((file) =>
      formData.append("image", file as any)
    );

    passportFiles.forEach((file) =>
      formData.append("logo", file as any)
    );

    if (editApplication) {
      await onUpdate(editApplication._id, formData);
    } else {
      await onAdd(formData);
    }

    form.resetFields();
  };

  const selectedMembershipType = Form.useWatch("membershipType", form);

  const selectedPlan = membershipData?.data?.find((plan: any) => plan.membershipType === selectedMembershipType);
  const isFamilyEnabled = (selectedPlan as any)?.familyMembershipOptions?.enableFamilyMembers === true;
  // Map membership data for Radio
  const organizeTypes = membershipData?.data?.map((type: any) => ({
    value: type._id,
    label: type.title,
    membershipType: type.membershipType,
  }));


  const handleProfileUpload = (file: UploadFile) => {
    setProfileImageFile([file]);

    const reader = new FileReader();
    reader.readAsDataURL(file as any);
    reader.onload = () => setProfilePreview(reader.result as string);

    return false;
  };

  return (
    <Modal
      open={open}
      title={
        editApplication
          ? "Edit Membership Application"
          : "Add Membership Application"
      }
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={1100}
      destroyOnClose
    >
      <Form form={form} layout="vertical">



        {/* Profile Image */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Profile Image"
              name="profileImage"
              rules={[{ required: true, message: "Profile Image is required" }]}
            >
              <Upload
                beforeUpload={handleProfileUpload}
                fileList={profileImageFile}
                onRemove={() => {
                  setProfileImageFile([]);
                  setProfilePreview(null);
                }}
                maxCount={1}
                accept="image/*"
                showUploadList={false} // hides default upload list
                style={{
                  position: "relative",
                  width: 128,
                  height: 128,
                  margin: "0 auto",
                  borderRadius: "50%",
                  border: "2px solid #D1D5DB", // gray-300
                  backgroundColor: "#F1F1F1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {profilePreview ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={profilePreview}
                      alt="Profile Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.25)",
                        opacity: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "opacity 0.3s",
                      }}
                      className="hover-opacity"
                    >
                      <p style={{ color: "#fff", fontSize: 12 }}>Change</p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      color: "#9CA3AF", // gray-400
                      padding: "0 16px",
                    }}
                  >
                    <BsUpload style={{ fontSize: 20, marginBottom: 8 }} />
                    <p style={{ fontSize: 14, fontWeight: 500 }}>Upload Profile Image</p>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Primary Info */}
        <h3>Primary Member Information</h3>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>


          <Col span={12}>
            <Form.Item name="jobTitle" label="Job Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>


          <Col span={12}>
            <Form.Item name="organizationName" label="Organization" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone" rules={[{ required: true }]}>
              <PhoneInput value={phone} onChange={setPhone} defaultCountry="ae" placeholder="Enter phone"

              />
            </Form.Item>
          </Col>


          <Col span={12}>
            <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="nationality" label="Nationality" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="countryOfResidence" label="Country of Residence" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="residenceAddress" label="Residence Address" style={{ width: "100%" }} rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <h3>Professional Background</h3>
        {/* Professional */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="industrySector" label="Industry Sector" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="yearsOfExperience" label="Years of Experience" rules={[{ required: true }]}>
              <InputNumber className="w-full" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="currentEmployer" label="Current Employer" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="workLocation" label="Work Location" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="annualGrossSalary" label="Annual Gross Salary" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <h3>Membership Type</h3>
        <Form.Item name="membershipType" rules={[{ required: true }]}>
          <Radio.Group className="flex flex-col gap-3" >
            {organizeTypes?.map((t: any) => (
              <Radio key={t.value} value={t.membershipType}>
                {t.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Family Details */}
        {isFamilyEnabled && (
          <div className="pt-6">
            <h3 className="font-semibold mb-3">Family Details</h3>

            {/* Spouse */}
            <Form.Item
              name={["family", "spouse", "name"]}
              label="Spouse Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter spouse name" />
            </Form.Item>

            <Form.Item
              name={["family", "spouse", "dob"]}
              label="Date of Birth"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name={["family", "spouse", "email"]}
              label="Email"
              rules={[{ type: "email", required: true }]}
            >
              <Input placeholder="Enter spouse email" />
            </Form.Item>

            <Form.Item
              name={["family", "spouse", "phone"]}
              label="Phone"
              rules={[{ required: true, message: "Spouse phone is required" }]}
            >
              <PhoneInput
                defaultCountry="ae"
                inputClassName="w-full rounded-md bg-[#F1F1F1] !h-10 border-none"
                placeholder="Enter spouse phone"
              />
            </Form.Item>

            {/* Children */}
            <h3 className="font-semibold mt-6 mb-3">Children</h3>

            <Form.List name={["family", "children"]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <div
                      key={field.key}
                      className="border border-gray-200! p-4 rounded-md mb-4"
                    >
                      <h4 className="mb-3 font-medium">
                        Child {index + 1}
                      </h4>

                      {/* Name + Age same row */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Form.Item
                          {...field}
                          name={[field.name, "name"]}
                          label="Name"
                          rules={[{ required: true }]}
                          className="flex-1"
                        >
                          <Input placeholder="Enter child name" />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          name={[field.name, "age"]}
                          label="Age"
                          rules={[
                            { required: true },
                            {
                              validator: (_, value) =>
                                value && value > 18
                                  ? Promise.reject(
                                    new Error("Child age must be 18 or below")
                                  )
                                  : Promise.resolve(),
                            },
                          ]}
                          className="w-full sm:w-40"
                        >
                          <InputNumber
                            min={0}
                            max={18}
                            className="w-full"
                          />
                        </Form.Item>
                      </div>

                      {fields.length > 0 && (
                        <Button
                          danger
                          type="link"
                          onClick={() => remove(field.name)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}

                  {fields.length < 2 && (
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                    >
                      Add Child
                    </Button>
                  )}
                </>
              )}
            </Form.List>
          </div>
        )}

        {/* Expire Date */}
        {
          editApplication && <Form.Item name="expireId" label="Expire Date">
            <DatePicker className="w-full" />
          </Form.Item>
        }




        {/* Benefits */}
        <h3>Benefits & Lifestyle Interests</h3>
        <Form.Item
          name="benefitsAndLifestyleInterests"
        >
          <Checkbox.Group
            options={benefitsInterests}
          />
        </Form.Item>


        {/* Documents */}
        <div className="pt-6">
          <h3>Required Documentation</h3>
          <Row gutter={[16, 16]}>
            {/* Emirates ID */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Emirates ID"
                name="image"
                rules={[
                  { required: true, message: "Emirates ID is required" },
                ]}
                className="w-full"
              >
                <Upload.Dragger
                  multiple
                  className="py-16 md:py-20"
                  // beforeUpload={(file) => handleUpload(file, setEmiratesIdFile)}
                  // fileList={emiratesIdFile}
                  // onRemove={(file) => setEmiratesIdFile(prev => prev.filter(f => f.uid !== file.uid))}
                  maxCount={2} // or whatever max you want
                >
                  <div className="flex flex-col items-center justify-center gap-2 h-full">
                    <BsUpload className="text-3xl text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-0 text-center">
                      Emirates ID (Front & Back)
                    </p>
                    <p className="text-xs text-amber">
                      Click or drag to upload
                    </p>
                  </div>
                </Upload.Dragger>
              </Form.Item>
            </Col>

            {/* Passport */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Passport"
                name="logo"
                rules={[{ required: true, message: "Passport is required" }]}
                className="w-full"
              >
                <Upload.Dragger
                  multiple
                  className="py-16 md:py-20"
                  // beforeUpload={(file) => handleUpload(file, setPassportFile)}
                  // fileList={passportFile}
                  // onRemove={(file) => setPassportFile(prev => prev.filter(f => f.uid !== file.uid))}
                  maxCount={2} // or whatever max you want
                >
                  <div className="flex flex-col items-center justify-center gap-2 h-full">
                    <BsUpload className="text-3xl text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-0 text-center">
                      Passport Photo (Primary Member)
                    </p>
                    <p className="text-xs text-amber">
                      Click or drag to upload
                    </p>
                  </div>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>
        </div>


        {/* Agreement */}
        <h3>Membership Acknowledgment</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Form.Item
            name="confirmAcknowledgement"
            valuePropName="checked"
            rules={[{ required: true, message: "Please confirm accuracy" }]}
            className="mb-2"
          >
            <Checkbox className="text-sm">
              I confirm that the information provided is accurate and complete
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="confirmAgreement"
            valuePropName="checked"
            rules={[{ required: true, message: "Please agree to the terms" }]}
            className="mb-0"
          >
            <Checkbox className="text-sm">
              I have read & agree to the ALPHA Membership terms & condition
            </Checkbox>
          </Form.Item>

        </div>
      </Form>
    </Modal>
  );
};