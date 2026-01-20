import {  Form, Input, Modal, Upload, Switch, InputNumber, Select, message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState, useMemo, useRef } from "react";
import type { ExclusiveOfferType } from ".";
import Editor from "react-simple-wysiwyg";
import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";
import { useGetOfferCategoriesQuery } from "../../redux/apiSlices/offerCategorySlice";

// NOTE: image & description are not in ExclusiveOfferType, handled as optional on editEvent.

export const ExclusiveOfferModel: React.FC<{
  open: boolean;
  loading: boolean;
  editEvent: ExclusiveOfferType | null;
  onClose: () => void;
  onAdd: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}> = ({ open, loading, editEvent, onClose, onAdd, onUpdate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [html, setHtml] = useState<string>("");
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  // Fetch offer categories with high enough limit to show all
  const { data, isLoading } = useGetOfferCategoriesQuery({ query: { page: 1, limit: 100 } });

  // Memoize options from fetched ad categories
  const categoryOptions = useMemo(
    () =>
      data && Array.isArray(data.data)
        ? data.data.map((cat: any) => ({
            label: cat.name,
            value: cat._id,
          }))
        : [],
    [data]
  );

  // Discount switch state (for UI)
  const [discountEnable, setDiscountEnable] = useState<boolean>(false);

  // Keep a ref to original image urls for removal reference
  const originalImagesRef = useRef<{ [uid: string]: string }>({});

  useEffect(() => {
    if (editEvent) {
      form.setFieldsValue({
        name: editEvent.name,
        title: editEvent.title,
        address: (editEvent as any).address || "",
        category: editEvent.category?._id,
        discountValue: editEvent.discount?.value ?? 0,
        discountEnable: !!editEvent.discount?.enable,
      });
      setHtml((editEvent as any).description || "");
      setDiscountEnable(!!editEvent.discount?.enable);

      const existingImages = (editEvent as any).image;
      let newFileList: UploadFile[] = [];
      let origImagesMap: { [uid: string]: string } = {};
      if (Array.isArray(existingImages)) {
        newFileList = existingImages.map((img: string, idx: number) => {
          const uid = String(-1 - idx);
          origImagesMap[uid] = img; // original path for this upload item
          return {
            uid,
            name: img.split("/").pop() || `image-${idx + 1}.png`,
            status: "done",
            url: `${imageUrl}/${img.replace(/^\/+/, "")}`,
          };
        });
      } else if (typeof existingImages === "string") {
        const uid = "-1";
        origImagesMap[uid] = existingImages;
        newFileList = [
          {
            uid,
            name: existingImages.split("/").pop() || "image.png",
            status: "done",
            url: `${imageUrl}/${existingImages.replace(/^\/+/, "")}`,
          },
        ];
      } else {
        newFileList = [];
      }
      setFileList(newFileList);
      originalImagesRef.current = origImagesMap;
      setRemovedFiles([]); // clean state on edit swap
    } else {
      setFileList([]);
      form.resetFields();
      setHtml("");
      setDiscountEnable(false);
      setRemovedFiles([]);
      originalImagesRef.current = {};
    }
    // eslint-disable-next-line
  }, [editEvent, form]);

  const handleRemove = (file: UploadFile) => {
    // Only files with status 'done' and url (existing), track for removal
    if (file.status === "done" && file.uid && originalImagesRef.current[file.uid]) {
      setRemovedFiles((prev) => {
        // Avoid duplicate removal
        if (prev.includes(originalImagesRef.current[file.uid])) return prev;
        return [...prev, originalImagesRef.current[file.uid]];
      });
    }
    // Let Upload remove it from preview list, our onChange will sync with fileList
    return true;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("title", values.title);
      formData.append("address", values.address);
      formData.append("description", html || "");
      if (values.category) {
        formData.append("category", values.category);
      }
      // Discount state
      formData.append("discount[enable]", String(!!values.discountEnable));
      formData.append(
        "discount[value]",
        !!values.discountEnable ? String(values.discountValue || 0) : "0"
      );

      // Append all selected files; API can accept multiple "image" entries
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("image", file.originFileObj as File);
        }
      });

      // If some files were removed, add the removal info
      if (removedFiles.length > 0) {
        removedFiles.forEach((imgPath) => {
          formData.append("removedFiles[]", imgPath);
        });
      }

      if (editEvent) {
        await onUpdate(editEvent._id, formData);
      } else {
        await onAdd(formData);
      }
      form.resetFields();
      setFileList([]);
      setHtml("");
      setDiscountEnable(false);
      setRemovedFiles([]);
      originalImagesRef.current = {};
    } catch (e: any) {
      // Ant Design form validation errors are shown inline, only show toast for API/server errors
      if (e && e.errorFields) {
        return;
      }

      // Attempt to extract error message from API/server error
      let errorMsg =
        (e && e.data && (e.data.message || e.data.error)) ||
        (e && e.message) ||
        undefined;

      if (errorMsg && typeof errorMsg === "string") {
        message.error(errorMsg);
      } else {
        message.error("An error occurred. Please check your input and try again.");
      }
    }
  };


  return (
    <Modal
      open={open}
      title={editEvent ? "Edit Exclusive Offer" : "Add Exclusive Offer"}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={editEvent ? "Update" : "Create"}
      width={650}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          discountEnable: false,
          discountValue: 0,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter offer name" }]}
        >
          <Input placeholder="Offer name" />
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter offer title" }]}
        >
          <Input placeholder="Offer title" />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter address" }]}
        >
          <Input placeholder="Address" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            placeholder={isLoading ? "Loading categories..." : "Select category"}
            options={categoryOptions}
            loading={isLoading}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          label="Enable Discount"
          name="discountEnable"
          valuePropName="checked"
        >
          <Switch
            checked={discountEnable}
            onChange={(checked) => {
              setDiscountEnable(checked);
              form.setFieldsValue({ discountEnable: checked });
              if (!checked) {
                form.setFieldsValue({ discountValue: 0 });
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label="Discount (%)"
          name="discountValue"
          rules={
            discountEnable
              ? [
                  { required: true, message: "Please enter discount value" },
                  { type: "number", min: 1, max: 100, message: "Enter 1-100" },
                ]
              : []
          }
        >
          <InputNumber
            min={1}
            max={100}
            placeholder="Discount (%)"
            disabled={!discountEnable}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          required={false}
          style={{ marginBottom: 24 }}
        >
          <Editor
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            aria-multiline
            style={{ minHeight: 150, height: 150 }}
            placeholder="Write Description"
          />
        </Form.Item>
        <Form.Item label="Image">
          <Upload.Dragger
            multiple
            beforeUpload={(file) => {
              const isJpgOrPng =
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/jpg";
              if (!isJpgOrPng) {
                Modal.error({
                  title: "Invalid file type",
                  content: "Only .jpeg, .png, .jpg file supported",
                });
              }
              return false;
            }}
            accept=".jpeg,.jpg,.png"
            fileList={fileList}
            onChange={(info) => {
              setFileList(info.fileList);
              // Note: Do not clear removedFiles here
            }}
            listType="picture"
            onRemove={handleRemove}
            style={{ width: "100%" }}
          >
            <div
              style={{
                width: "100%",
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UploadOutlined style={{ fontSize: 32, color: '#999' }} />
              <p style={{ margin: 8, fontWeight: 500 }}>
                Please upload an image <br />
                <span style={{ color: "#888", fontWeight: 400, fontSize: 13 }}>
                  Recommended size: <strong>390 x 220</strong>
                </span>
              </p>
            </div>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};