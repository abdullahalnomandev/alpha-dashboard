import { Carousel, Modal } from "antd";
import type { ExclusiveOfferType } from ".";
import { imageUrl } from "../../redux/api/baseApi";
import { EnvironmentFilled } from "@ant-design/icons";

export const ExclusiveOfferInfoModal: React.FC<{
  open: boolean;
  data: ExclusiveOfferType | null;
  onClose: () => void;
}> = ({ open, data, onClose }) => {
  if (!data) return null;

  // Normalize image field to an array of urls/paths
  const rawImages = (data as any).image as string | string[] | undefined;
  const images: string[] = Array.isArray(rawImages)
    ? rawImages.filter(Boolean)
    : typeof rawImages === "string" && rawImages
    ? [rawImages]
    : [];

  const imageUrls = images.map((img) =>
    img.startsWith("http") ? img : `${imageUrl}/${img.replace(/^\/+/, "")}`
  );

  // Determine location (address or similar field)
  const locationStr =
    (data as any).address ||
    (data as any).location ||
    "";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      destroyOnHidden
      title={null}
      styles={{
        body: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden"
        }
      }}
      style={{ borderRadius: 16, padding: 0 }}
    >
      <div style={{
        borderRadius: 16,
        marginTop:8,
        overflow: "hidden",
        background: "#fff",
        fontFamily: "inherit"
      }}>
        {/* Top: Images */}
        <div
          style={{
            width: "100%",
            marginTop: 20,
            background: "#f6f8fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imageUrls.length ? (
            <div style={{ width: "100%" }}>
              <Carousel
                dots
                autoplay={imageUrls.length > 1}
                autoplaySpeed={1500}
                draggable
                adaptiveHeight
              >
                {imageUrls.map((src, idx) => (
                  <div key={`${src}-${idx}`}>
                    <div
                      style={{
                        width: "100%",
                        height: 280,
                        background: "#f6f8fa",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={src}
                        alt={`offer-${idx + 1}`}
                        style={{
                          width: "100%",
                          height: 280,
                          objectFit: "contain",
                          display: "block",
                          background: "#f6f8fa",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: 180,
                background: "#f6f8f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ccc",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              No image
            </div>
          )}
        </div>
        {/* Main info card */}
        <div style={{
          padding: "20px 22px 0 22px",
          background: "#fff"
        }}>
          {/* Title, restaurant name */}
          <div style={{ fontSize: 19, fontWeight: 600, color: "#294183", marginBottom: 4 }}>
            {data.title}
          </div>
          <div style={{ color: "#555a6a", fontWeight: 500, fontSize: 16, marginBottom: 7 }}>
            {data.name}
          </div>
          {/* Address/Location */}
          {(!!locationStr || !!data.category?.name) && (
            <div style={{
              display: "flex",
              alignItems: "center",
              color: "#fa541c",
              fontSize: 14,
              marginBottom: 12
            }}>
              <EnvironmentFilled style={{ marginRight: 5, fontSize: 15, color: "#fa541c" }} />
              <span>{locationStr ? locationStr : "-"}</span>
              {/* Optionally show category name as a separate visual info */}
              {data.category?.name && (
                <span style={{
                  color: "#25396d",
                  marginLeft: 8,
                  fontWeight: 400,
                  fontSize: 13,
                  background: "#f4f6fb",
                  borderRadius: 8,
                  padding: "1px 7px"
                }}>
                  {data.category.name}
                </span>
              )}
            </div>
          )}
          {/* Description */}
          <div style={{
            fontWeight: 500,
            color: "#253347",
            fontSize: 16,
            marginBottom: 0
          }}>
            Description
          </div>
          <div
            style={{
              color: "#777D8F",
              fontSize: 14,
              marginBottom: 18,
              marginTop: 2,
              minHeight: 22,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {"description" in data && (data as any).description ? (
              <span
                style={{ display: "block" }}
                dangerouslySetInnerHTML={{ __html: (data as any).description }}
              />
            ) : (
              <span style={{ color: "#bbb" }}>No description provided.</span>
            )}
          </div>
          {/* Bulleted/Check info (parse out from description after first paragraph?) */}
          {(data as any).features?.length ? (
            <ul style={{
              margin: "0 0 0 15px",
              padding: 0,
              color: "#232f3e",
              fontSize: 14,
              lineHeight: "23px",
              listStyle: "disc"
            }}>
              {(data as any).features.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
          {/* You may wish to adjust how these bullet/check info is extracted; for now, skip */}
          {/* Terms & Conditions */}
          {(data as any).terms ||
          (Array.isArray((data as any).termsAndConditions) && (data as any).termsAndConditions.length > 0) ? (
            <div style={{
              marginTop: 24,
              background: "#fbfcfd",
              borderRadius: 12,
              border: "1px solid #f4f5f6",
              padding: "14px 16px 13px 16px"
            }}>
              <div style={{
                color: "#22346d",
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 6
              }}>
                Terms & Conditions
              </div>
              <ul style={{
                color: "#777D8F",
                fontSize: 14,
                margin: 0,
                paddingLeft: 17,
                lineHeight: "22px"
              }}>
                {(Array.isArray((data as any).termsAndConditions)
                  ? (data as any).termsAndConditions
                  : ((data as any).terms || "").split(/\n|\. /).filter((t: string) => t.trim())
                ).map((term: string, i: number) => (
                  <li key={i}>{term.trim()?.replace(/^\s*[-–•✓\u2713]+\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};


// TEMP WLL ADD AFTER GIVE THE GOOGLE API KEY
// import {
//   Form,
//   Input,
//   Modal,
//   Upload,
//   Switch,
//   InputNumber,
//   Select,
//   message,
// } from "antd";
// import type { UploadFile } from "antd/es/upload/interface";
// import { useEffect, useState, useMemo, useRef } from "react";
// import type { ExclusiveOfferType } from ".";
// import Editor from "react-simple-wysiwyg";
// import { UploadOutlined } from "@ant-design/icons";
// import { imageUrl } from "../../redux/api/baseApi";
// import { useGetOfferCategoriesQuery } from "../../redux/apiSlices/offerCategorySlice";
// import { useGetALlPartnerUsersQuery } from "../../redux/apiSlices/userSlice";
// import ReactGoogleAutocomplete from "react-google-autocomplete";

// export const ExclusiveOfferModel: React.FC<{
//   open: boolean;
//   loading: boolean;
//   editEvent: ExclusiveOfferType | null;
//   onClose: () => void;
//   onAdd: (formData: FormData) => Promise<void>;
//   onUpdate: (id: string, formData: FormData) => Promise<void>;
// }> = ({ open, loading, editEvent, onClose, onAdd, onUpdate }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [html, setHtml] = useState<string>("");
//   const [businessHtml, setBusinessHtml] = useState<string>("");
//   const [removedFiles, setRemovedFiles] = useState<string[]>([]);
//   const [userSearch, setUserSearch] = useState<string>("");

//   // Fetch offer categories with high enough limit to show all
//   const { data, isLoading } = useGetOfferCategoriesQuery({
//     query: { page: 1, limit: 100 },
//   });
//   const { data: users, isLoading: usersLoading } = useGetALlPartnerUsersQuery({
//     query: {
//       page: 1,
//       limit: 10,
//       searchTerm: userSearch,
//     },
//   });

//   // Memoize options from fetched ad categories
//   const categoryOptions = useMemo(
//     () =>
//       data && Array.isArray(data.data)
//         ? data.data.map((cat: any) => ({
//             label: cat.name,
//             value: cat._id,
//           }))
//         : [],
//     [data],
//   );

//   const userOptions = useMemo(
//     () =>
//       users?.data?.data?.map((user: any) => ({
//         label: `${user.name} - ${user.partnerShipId}`,
//         value: user._id,
//       })) || [],
//     [users],
//   );

//   // Discount switch state (for UI)
//   const [discountEnable, setDiscountEnable] = useState<boolean>(false);

//   // Keep a ref to original image urls for removal reference
//   const originalImagesRef = useRef<{ [uid: string]: string }>({});

//   useEffect(() => {
//     if (editEvent) {
//       form.setFieldsValue({
//         name: editEvent.name,
//         title: editEvent.title,
//         address: (editEvent as any).address || "",
//         category: editEvent.category?._id,
//         discountValue: editEvent.discount?.value ?? 0,
//         discountEnable: !!editEvent.discount?.enable,
//         user: editEvent?.user
//           ? {
//               value: editEvent.user._id,
//               label: `${editEvent.user.name}`,
//             }
//           : undefined,
//       });
//       setHtml((editEvent as any).description || "");
//       setBusinessHtml((editEvent as any).businessDescription || "");
//       setDiscountEnable(!!editEvent.discount?.enable);

//       const existingImages = (editEvent as any).image;
//       let newFileList: UploadFile[] = [];
//       let origImagesMap: { [uid: string]: string } = {};
//       if (Array.isArray(existingImages)) {
//         newFileList = existingImages.map((img: string, idx: number) => {
//           const uid = String(-1 - idx);
//           origImagesMap[uid] = img;
//           return {
//             uid,
//             name: img.split("/").pop() || `image-${idx + 1}.png`,
//             status: "done",
//             url: `${imageUrl}/${img.replace(/^\/+/, "")}`,
//           };
//         });
//       } else if (typeof existingImages === "string") {
//         const uid = "-1";
//         origImagesMap[uid] = existingImages;
//         newFileList = [
//           {
//             uid,
//             name: existingImages.split("/").pop() || "image.png",
//             status: "done",
//             url: `${imageUrl}/${existingImages.replace(/^\/+/, "")}`,
//           },
//         ];
//       } else {
//         newFileList = [];
//       }
//       setFileList(newFileList);
//       originalImagesRef.current = origImagesMap;
//       setRemovedFiles([]);
//     } else {
//       setFileList([]);
//       form.resetFields();
//       setHtml("");
//       setBusinessHtml("");
//       setDiscountEnable(false);
//       setRemovedFiles([]);
//       originalImagesRef.current = {};
//     }
//     // eslint-disable-next-line
//   }, [editEvent, form]);

//   const handleRemove = (file: UploadFile) => {
//     if (
//       file.status === "done" &&
//       file.uid &&
//       originalImagesRef.current[file.uid]
//     ) {
//       setRemovedFiles((prev) => {
//         if (prev.includes(originalImagesRef.current[file.uid])) return prev;
//         return [...prev, originalImagesRef.current[file.uid]];
//       });
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       const formData = new FormData();

//       formData.append("name", values.name);
//       formData.append("title", values.title);
//       formData.append("address", values.address);
//       formData.append("description", html || "");
//       formData.append("businessDescription", businessHtml || "");

//       if (values.category) {
//         formData.append("category", values.category);
//       }

//       formData.append("discount[enable]", String(!!values.discountEnable));
//       formData.append(
//         "discount[value]",
//         !!values.discountEnable ? String(values.discountValue || 0) : "0",
//       );

//       fileList.forEach((file) => {
//         if (file.originFileObj) {
//           formData.append("image", file.originFileObj as File);
//         }
//       });

//       if (removedFiles.length > 0) {
//         removedFiles.forEach((imgPath) => {
//           formData.append("removedFiles[]", imgPath);
//         });
//       }

//       if (values.user) {
//         formData.append(
//           "user",
//           typeof values.user === "object" ? values.user.value : values.user,
//         );
//       }

//       if (editEvent) {
//         await onUpdate(editEvent._id, formData);
//       } else {
//         await onAdd(formData);
//       }

//       form.resetFields();
//       setFileList([]);
//       setHtml("");
//       setBusinessHtml("");
//       setDiscountEnable(false);
//       setRemovedFiles([]);
//       originalImagesRef.current = {};
//     } catch (e: any) {
//       if (e && e.errorFields) {
//         return;
//       }

//       let errorMsg =
//         (e && e.data && (e.data.message || e.data.error)) ||
//         (e && e.message) ||
//         undefined;

//       if (errorMsg && typeof errorMsg === "string") {
//         message.error(errorMsg);
//       } else {
//         message.error(
//           "An error occurred. Please check your input and try again.",
//         );
//       }
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       title={editEvent ? "Edit Exclusive Offer" : "Add Exclusive Offer"}
//       onCancel={onClose}
//       onOk={handleSubmit}
//       confirmLoading={loading}
//       okText={editEvent ? "Update" : "Create"}
//       width={650}
//       destroyOnClose
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         initialValues={{
//           discountEnable: false,
//           discountValue: 0,
//         }}
//       >
//         <Form.Item
//           label="Name"
//           name="name"
//           rules={[{ required: true, message: "Please enter offer name" }]}
//         >
//           <Input placeholder="Offer name" />
//         </Form.Item>

//         <Form.Item
//           label="Title"
//           name="title"
//           rules={[{ required: true, message: "Please enter offer title" }]}
//         >
//           <Input placeholder="Offer title" />
//         </Form.Item>

//         {/* ── Address with Google Places Autocomplete ── */}
//         <Form.Item
//           label="Address"
//           name="address"
//           rules={[{ required: true, message: "Please enter address" }]}
//         >
//           <ReactGoogleAutocomplete
//             apiKey={import.meta.env.VITE_SEARCH_API_KEY}
//             onPlaceSelected={(place) => {
//               form.setFieldsValue({
//                 address: place.formatted_address ?? "",
//               });
//             }}
//             options={{
//               types: [],
//             }}
//             // Make it look like an Ant Design Input
//             style={{
//               width: "100%",
//               height: 32,
//               padding: "4px 11px",
//               fontSize: 14,
//               lineHeight: 1.5714,
//               border: "1px solid #d9d9d9",
//               borderRadius: 6,
//               outline: "none",
//               transition: "border-color 0.2s, box-shadow 0.2s",
//               boxSizing: "border-box",
//             }}
//             onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
//               e.target.style.borderColor = "#4096ff";
//               e.target.style.boxShadow = "0 0 0 2px rgba(5,145,255,0.1)";
//             }}
//             onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
//               e.target.style.borderColor = "#d9d9d9";
//               e.target.style.boxShadow = "none";
//             }}
//             defaultValue={(editEvent as any)?.address || ""}
//             placeholder="Search address in UAE"
//           />
//         </Form.Item>

//         <Form.Item
//           label="Category"
//           name="category"
//           rules={[{ required: true, message: "Please select a category" }]}
//         >
//           <Select
//             placeholder={
//               isLoading ? "Loading categories..." : "Select category"
//             }
//             options={categoryOptions}
//             loading={isLoading}
//             showSearch
//             optionFilterProp="label"
//           />
//         </Form.Item>

//         <Form.Item label="User" name="user">
//           <Select
//             placeholder={
//               usersLoading ? "Loading users..." : "Search name or email"
//             }
//             options={userOptions}
//             loading={usersLoading}
//             allowClear
//             showSearch
//             filterOption={false}
//             onSearch={(value) => setUserSearch(value)}
//             optionFilterProp="label"
//           />
//         </Form.Item>

//         <Form.Item
//           label="Enable Discount"
//           name="discountEnable"
//           valuePropName="checked"
//         >
//           <Switch
//             checked={discountEnable}
//             onChange={(checked) => {
//               setDiscountEnable(checked);
//               form.setFieldsValue({ discountEnable: checked });
//               if (!checked) {
//                 form.setFieldsValue({ discountValue: 0 });
//               }
//             }}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Discount (%)"
//           name="discountValue"
//           rules={
//             discountEnable
//               ? [
//                   { required: true, message: "Please enter discount value" },
//                   { type: "number", min: 1, max: 100, message: "Enter 1-100" },
//                 ]
//               : []
//           }
//         >
//           <InputNumber
//             min={1}
//             max={100}
//             placeholder="Discount (%)"
//             disabled={!discountEnable}
//             style={{ width: "100%" }}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Offer Description"
//           required={false}
//           style={{ marginBottom: 24 }}
//         >
//           <Editor
//             value={html}
//             onChange={(e) => setHtml(e.target.value)}
//             aria-multiline
//             style={{ minHeight: 150, height: 150 }}
//             placeholder="Write Offer Description"
//           />
//         </Form.Item>

//         <Form.Item
//           label="Business Description"
//           required={false}
//           style={{ marginBottom: 24 }}
//         >
//           <Editor
//             value={businessHtml}
//             onChange={(e) => setBusinessHtml(e.target.value)}
//             aria-multiline
//             style={{ minHeight: 150, height: 150 }}
//             placeholder="Write Business Description"
//           />
//         </Form.Item>

//         <Form.Item label="Image">
//           <Upload.Dragger
//             multiple
//             beforeUpload={(file) => {
//               const isJpgOrPng =
//                 file.type === "image/jpeg" ||
//                 file.type === "image/png" ||
//                 file.type === "image/jpg";
//               if (!isJpgOrPng) {
//                 Modal.error({
//                   title: "Invalid file type",
//                   content: "Only .jpeg, .png, .jpg file supported",
//                 });
//               }
//               return false;
//             }}
//             accept=".jpeg,.jpg,.png"
//             fileList={fileList}
//             onChange={(info) => setFileList(info.fileList)}
//             listType="picture"
//             onRemove={handleRemove}
//             style={{ width: "100%" }}
//           >
//             <div
//               style={{
//                 width: "100%",
//                 minHeight: 150,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <UploadOutlined style={{ fontSize: 32, color: "#999" }} />
//               <p style={{ margin: 8, fontWeight: 500 }}>
//                 Please upload an image <br />
//                 <span style={{ color: "#888", fontWeight: 400, fontSize: 13 }}>
//                   Recommended size: <strong>390 x 220</strong>
//                 </span>
//               </p>
//             </div>
//           </Upload.Dragger>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };