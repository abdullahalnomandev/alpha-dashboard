import { DatePicker, Form, Input, Modal, TimePicker, Upload } from "antd";
import { useEffect, useState } from "react";
import type { EventType } from ".";
import dayjs from "dayjs";
import Editor from "react-simple-wysiwyg";

import { UploadOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

const { Dragger } = Upload;

export const EventFormModal: React.FC<{
    open: boolean;
    loading: boolean;
    editEvent: EventType | null;
    onClose: () => void;
    onAdd: (formData: FormData) => Promise<void>;
    onUpdate: (id: string, formData: FormData) => Promise<void>;
  }> = ({ open, loading, editEvent, onClose, onAdd, onUpdate }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    // const [preview, setPreview] = useState<string | undefined>(undefined);
    const [html, setHtml] = useState<string>("");

    useEffect(() => {
      if (editEvent) {
        form.setFieldsValue({
          name: editEvent.name,
          title: editEvent.title,
          location: editEvent.location,
          eventDate: editEvent.eventDate
            ? dayjs(editEvent.eventDate)
            : undefined,
          eventTime: editEvent.eventTime
            ? dayjs(editEvent.eventTime, "HH:mm")
            : undefined,
        });
        setHtml(editEvent.description || "");
        if (editEvent.image) {
        //   setPreview(editEvent.image);
          setFileList([]);
        }
      } else {
        setFileList([]);
        // setPreview(undefined);
        form.resetFields();
        setHtml("");
      }
      // eslint-disable-next-line
    }, [editEvent, form]);

    const handleSubmit = async () => {
      const values = await form.validateFields();
      const formData = new FormData();

      for (const k of Object.keys(values)) {
        if (k === "eventDate" && values[k]) {
          formData.append("eventDate", values[k].startOf("day").toISOString());
        } else if (k === "eventTime" && values[k]) {
          formData.append("eventTime", values[k].format("HH:mm"));
        }
        else if (values[k]) {
          formData.append(k, values[k]);
        }
      }
      // Add description if present
      if (html && html.trim()) {
        formData.append("description", html);
      } else {
        // You can make this field required by adding validation if needed
        formData.append("description", "");
      }
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editEvent) {
        await onUpdate(editEvent._id, formData);
      } else {
        await onAdd(formData);
      }
      form.resetFields();
      setFileList([]);
    //   setPreview(undefined);
      setHtml("");
    };

    return (
      <Modal
        open={open}
        title={editEvent ? "Edit Event" : "Add Event"}
        onCancel={onClose}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText={editEvent ? "Update" : "Create"}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter event name" }]}
          >
            <Input placeholder="Event name" />
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter event title" }]}
          >
            <Input placeholder="Event title" />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter event location" }]}
          >
            <Input placeholder="Event location" />
          </Form.Item>
          <Form.Item
            label="Date"
            name="eventDate"
            rules={[{ required: true, message: "Please enter event date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              placeholder="Select date"
            />
          </Form.Item>
          <Form.Item
            label="Time"
            name="eventTime"
            rules={[{ required: true, message: "Please enter event time" }]}
          >
            <TimePicker
              use12Hours
              format="hh:mm A"
              minuteStep={1}
              style={{ width: "100%" }}
              placeholder="Select time"
            />
          </Form.Item>
          <Form.Item
            label="Description"
            required={false}
            style={{ marginBottom: 24 }}
          >
            <Editor
              value={html}
              onChange={e => setHtml(e.target.value)}
              aria-multiline
              color="red"
              style={{minHeight: 150, height: 150 }}
              placeholder="Write Description"
            />
          </Form.Item>
          <Form.Item label="Image">
            <Dragger
              beforeUpload={(file) => {
                const isJpgOrPng =
                  file.type === "image/jpeg" ||
                  file.type === "image/png" ||
                  file.type === "image/jpg";
                if (!isJpgOrPng) {
                  Modal.error({
                    title: "Invalid file type",
                    content: "Only .jpeg, .png, .jpg files are supported",
                  });
                  return Upload.LIST_IGNORE;
                }
                return false; // Prevent upload auto, handle manually
              }}
              accept=".jpeg,.jpg,.png"
              fileList={
                fileList.length
                  ? fileList
                  : editEvent?.image
                  ? [
                      {
                        uid: "-1",
                        name: editEvent.image.split("/").pop() || "image.png",
                        status: "done",
                        url: imageUrl + "/" + editEvent.image,
                      },
                    ]
                  : []
              }
              onChange={(info) => {
                setFileList(info.fileList.slice(-1));
              }}
              listType="picture"
              maxCount={1}
              style={{ padding: "8px 0" }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: "#1890ff", fontSize: 22 }} />
              </p>
              <p className="ant-upload-text">
                Click or drag image to this area to upload
              </p>
              <p className="ant-upload-hint">
                Only JPEG/PNG/JPG files are supported. Max one image.<br />
                Recommended size: <strong>390 x 220</strong>
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    );
  };
