// import { Form, Modal, DatePicker, Input, Select } from "antd";
// import { useEffect, useState, useMemo, useCallback } from "react";
// import type { MembershipApplicationType, FamilyMember } from ".";
// import dayjs from "dayjs";
// import { useGetMembershipPlansQuery } from "../../redux/apiSlices/membershipPlanSlice";
// import { imageUrl } from "../../redux/api/baseApi";

// const { Option } = Select;


// function formatType(val: string) {
//   if (!val) return "";
//   return val
//     .replace(/_/g, " ")
//     .replace(/-/g, " ")
//     .replace(/(^\w|\s\w)/g, m => m.toUpperCase());
// }

// export const MemberShipApplicationCreate: React.FC<{
//   open: boolean;
//   loading: boolean;
//   editApplication: MembershipApplicationType | null;
//   onClose: () => void;
//   onAdd: (values: any) => Promise<void>;
//   onUpdate: (id: string, values: any) => Promise<void>;
// }> = ({
//   open,
//   loading,
//   editApplication,
//   onClose,
//   onAdd,
//   onUpdate,
// }) => {
//     const [form] = Form.useForm();
//     const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
//     const [selectedMembershipType, setSelectedMembershipType] = useState<string | undefined>(undefined);
//     const [familyMembersEnabled, setFamilyMembersEnabled] = useState<boolean>(false);
//     const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
//     const [profilePreview, setProfilePreview] = useState<string | null>(null);
//     const { data: membershipPlansResponse } = useGetMembershipPlansQuery({});

//     // Build membership type options from API data
//     const membershipTypeOptions = useMemo(() => {
//       if (membershipPlansResponse && Array.isArray(membershipPlansResponse.data)) {
//         return membershipPlansResponse.data.map((plan: any) => ({
//           value: plan.membershipType,
//           label: formatType(plan.membershipType)
//         }));
//       }
//       return [];
//     }, [membershipPlansResponse]);

//     const checkFamilyEnabled = useCallback((membershipTypeValue?: string) => {
//       if (!membershipPlansResponse || !membershipPlansResponse.data) return false;
//       const plans = membershipPlansResponse.data as any[];
//       const found = plans.find(plan => plan.membershipType === membershipTypeValue);
//       return !!(
//         found &&
//         found.familyMembershipOptions &&
//         found.familyMembershipOptions.enableFamilyMembers
//       );
//     }, [membershipPlansResponse]);

//     useEffect(() => {
//       let newSelectedType: string | undefined;
//       if (editApplication) {
//         form.setFieldsValue({
//           // address intentionally omitted based on instruction
//           membershipType: editApplication.membershipType,
//           expireId: editApplication.expireId ? dayjs(editApplication.expireId) : null,
//           from: editApplication.from,
//         });

//         if (editApplication?.profileImage) {
//           setProfilePreview(imageUrl + editApplication.profileImage);
//         } else {
//           setProfilePreview(null);
//         }
//         setProfileImageFile(null);
//         setFamilyMembers(editApplication.familyMembers || []);
//         newSelectedType = editApplication.membershipType;
//       } else {
//         form.resetFields();
//         setFamilyMembers([]);
//         if (membershipTypeOptions.length > 0) {
//           newSelectedType = membershipTypeOptions[0].value;
//           form.setFieldsValue({
//             membershipType: newSelectedType,
//           });
//         }
//       }
//       setSelectedMembershipType(newSelectedType);
//       // eslint-disable-next-line
//     }, [editApplication, form, membershipTypeOptions]);

//     useEffect(() => {
//       setFamilyMembersEnabled(
//         checkFamilyEnabled(selectedMembershipType)
//       );
//     }, [selectedMembershipType, checkFamilyEnabled]);

//     const handleMembershipTypeChange = (value: string) => {
//       setSelectedMembershipType(value);
//       // Reset family members if family membership disables
//       if (!checkFamilyEnabled(value)) {
//         setFamilyMembers([]);
//       }
//       form.setFieldsValue({ membershipType: value });
//     };


//     const handleSubmit = async () => {
//       const values = await form.validateFields();

//       if (values.expireId) {
//         values.expireId = values.expireId.toISOString();
//       }

//       values.familyMembers = familyMembersEnabled
//         ? familyMembers.filter(fm => fm.name && fm.relation)
//         : [];

//       // Remove fields you don't want to send
//       delete values.memberShipId;
//       delete values.membershipStatus;
//       delete values.address; // if you don't want to update address

//       // --- CREATE FORM DATA ---
//       const formData = new FormData();
//       for (const key in values) {
//         const val = (values as any)[key];
//         if (Array.isArray(val)) {
//           // For arrays, append each value individually
//           val.forEach((v: any) => {
//             formData.append(`${key}[]`, typeof v === "object" ? JSON.stringify(v) : v);
//           });
//         } else if (val instanceof File) {
//           formData.append(key, val); // File goes directly
//         } else if (typeof val === "object" && val !== null) {
//           formData.append(key, JSON.stringify(val)); // Objects stringify
//         } else if (val !== undefined && val !== null) {
//           formData.append(key, val);
//         }
//       }

//       // Append profile image
//       if (profileImageFile) {
//         formData.append("profileImage", profileImageFile);
//       }

//       if (editApplication) {
//         await onUpdate(editApplication._id, formData);
//       } else {
//         await onAdd(formData);
//       }

//       form.resetFields();
//       setFamilyMembers([]);
//     };

//     return (
//       <>
//         <Modal
//           open={open}
//           title={editApplication ? "Edit Membership Application" : "Add Membership Application"}
//           onCancel={onClose}
//           onOk={handleSubmit}
//           confirmLoading={loading}
//           okText={editApplication ? "Update" : "Create"}
//           width={600}
//           destroyOnClose
//         >
//           {/* --- Main Form fields --- */}
//           <Form form={form} layout="vertical">
//             <Form.Item label="Profile Image">
//               <div style={{ textAlign: "center" }}>
//                 {profilePreview && (
//                   <div
//                     style={{
//                       width: 90,
//                       height: 90,
//                       borderRadius: "50%",
//                       overflow: "hidden",
//                       margin: "0 auto 12px auto",
//                     }}
//                   >
//                     <img
//                       src={profilePreview}
//                       alt="Profile Preview"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                       }}
//                     />
//                   </div>
//                 )}

//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       setProfileImageFile(file);
//                       setProfilePreview(URL.createObjectURL(file)); // preview
//                     }
//                   }}
//                 />
//               </div>
//             </Form.Item>
//             {/* Membership ID and Status removed */}
//             <Form.Item
//               label="Membership Type"
//               name="membershipType"
//               rules={[{ required: true, message: "Please select membership type" }]}
//             >
//               <Select
//                 placeholder="Select membership type"
//                 loading={!membershipTypeOptions.length}
//                 onChange={handleMembershipTypeChange}
//                 value={selectedMembershipType}
//               >
//                 {membershipTypeOptions.map((option: { value: string }) => (
//                   <Option key={option.value} value={option.value}>
//                     {formatType(option.value)}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//             {/* Name field removed as per instruction */}
//             {/* Address field is now omitted from the form for update */}
//             {!editApplication && (
//               <Form.Item
//                 label="Address"
//                 name="address"
//               >
//                 <Input placeholder="Address" />
//               </Form.Item>
//             )}
//             <Form.Item
//               label="Expiry Date"
//               name="expireId"
//               rules={[{ required: true, message: "Please select expiry date" }]}
//             >
//               <DatePicker
//                 style={{ width: "100%" }}
//                 showTime={false}
//                 format="YYYY-MM-DD"
//                 disabledDate={current => current && current < dayjs().startOf('day')}
//                 placeholder="Select expiry date"
//               />
//             </Form.Item>

//           </Form>
//         </Modal>
//       </>
//     );
//   };





//       // {/* Family Members */}
//       //       {familyMembersEnabled && (
//       //         <div style={{ marginTop: 20 }}>
//       //           <div style={{ marginBottom: 8, fontWeight: 500 }}>Family Members (optional):</div>
//       //           {familyMembers.map((fm, idx) => (
//       //             <Space align="start" style={{ display: "flex", marginBottom: 8 }} key={idx}>
//       //               <Input
//       //                 placeholder="Name"
//       //                 value={fm.name}
//       //                 style={{ minWidth: 120 }}
//       //                 onChange={e => updateFamilyMember(idx, "name", e.target.value)}
//       //               />
//       //               <Input
//       //                 placeholder="Email"
//       //                 value={fm.email}
//       //                 style={{ minWidth: 150 }}
//       //                 onChange={e => updateFamilyMember(idx, "email", e.target.value)}
//       //               />
//       //               <Select
//       //                 placeholder="Relation"
//       //                 value={fm.relation}
//       //                 style={{ minWidth: 120 }}
//       //                 onChange={value => updateFamilyMember(idx, "relation", value)}
//       //               >
//       //                 {FAMILY_RELATION_OPTIONS.map(option => (
//       //                   <Option key={option.value} value={option.value}>
//       //                     {option.label}
//       //                   </Option>
//       //                 ))}
//       //               </Select>
//       //               <Button danger type="link" onClick={() => removeFamilyMember(idx)} style={{ color: "#f5222d" }}>
//       //                 Remove
//       //               </Button>
//       //             </Space>
//       //           ))}
//       //           <Button
//       //             type="dashed"
//       //             style={{ marginTop: 6 }}
//       //             onClick={addFamilyMember}
//       //             block
//       //           >
//       //             + Add Family Member
//       //           </Button>
//       //         </div>
//       //       )}
"use client";

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
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface Props {
  open: boolean;
  loading: boolean;
  editApplication: any | null;
  onClose: () => void;
  onAdd: (values: FormData) => Promise<void>;
  onUpdate: (id: string, values: FormData) => Promise<void>;
}

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
        <Form.Item label="Profile Image">
          <Upload beforeUpload={(file) => {
            setProfileFile([file]);
            return false;
          }}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        {/* Primary Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>


          <Col span={12}>
            <Form.Item name="jobTitle" label="Job Title">
              <Input />
            </Form.Item>
          </Col>


          <Col span={12}>
            <Form.Item name="organizationName" label="Organization">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone" required>
              <PhoneInput value={phone} onChange={setPhone} country="ae" />
            </Form.Item>
          </Col>


          <Col span={12}>
            <Form.Item name="dateOfBirth" label="Date of Birth">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="nationality" label="Nationality">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="countryOfResidence" label="Country of Residence">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="residenceAddress" label="Residence Address" style={{ width: "100%" }}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <h3>Professional Background</h3>
        {/* Professional */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="industrySector" label="Industry Sector">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="yearsOfExperience" label="Years of Experience">
              <InputNumber className="w-full"  style={{width:'100%'}} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="currentEmployer" label="Current Employer">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="workLocation" label="Work Location">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="annualGrossSalary" label="Annual Gross Salary">
              <InputNumber style={{width:'100%'}} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="membershipType"
          label="Membership Type"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="individual">Individual</Select.Option>
            <Select.Option value="family">Family</Select.Option>
          </Select>
        </Form.Item>

        {/* Expire Date */}
        <Form.Item name="expireId" label="Expire Date">
          <DatePicker className="w-full" />
        </Form.Item>




        {/* Benefits */}
        <Form.Item
          name="benefitsAndLifestyleInterests"
          label="Benefits & Interests"
        >
          <Checkbox.Group
            options={[
              "networking",
              "sports",
              "family",
              "travel",
              "automotive",
              "lifestyle",
            ]}
          />
        </Form.Item>

        {/* Family */}
        <Form.List name={["family", "children"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key}>
                  <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    label={`Child ${index + 1} Name`}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, "age"]}
                    label="Age"
                  >
                    <InputNumber min={0} max={18} />
                  </Form.Item>

                  <Button danger onClick={() => remove(field.name)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()}>
                Add Child
              </Button>
            </>
          )}
        </Form.List>

        {/* Documents */}
        <Form.Item label="Emirates ID">
          <Upload.Dragger
            multiple
            beforeUpload={(file) => {
              setEmiratesFiles((prev) => [...prev, file]);
              return false;
            }}
          >
            Upload Emirates ID
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Passport">
          <Upload.Dragger
            multiple
            beforeUpload={(file) => {
              setPassportFiles((prev) => [...prev, file]);
              return false;
            }}
          >
            Upload Passport
          </Upload.Dragger>
        </Form.Item>

        {/* Agreement */}
        <Form.Item name="confirmAcknowledgement" valuePropName="checked">
          <Checkbox>Confirm Information</Checkbox>
        </Form.Item>

        <Form.Item name="confirmAgreement" valuePropName="checked">
          <Checkbox>Agree to Terms</Checkbox>
        </Form.Item>

      </Form>
    </Modal>
  );
};