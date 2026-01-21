import React, { useMemo, useState } from "react";
import {
  Table,
  Typography,
  Input,
  Button,
  Spin,
  message,
  Space,
  Popconfirm,
  Tooltip
} from "antd";

import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "../../redux/apiSlices/eventSlice";
import { imageUrl } from "../../redux/api/baseApi";
import { EditorProvider } from "react-simple-wysiwyg";
import { EventInfoModal } from "./EventInfoModel";
import { EventFormModal } from "./EventModel";
import { Link } from "react-router-dom";

const { Text } = Typography;

/* =====================
   Types
===================== */
export type EventType = {
  _id: string;
  name: string;
  title: string;
  image: string;
  location: string;
  description?: string;
  eventDate: string; // ISO string: "2026-11-15T00:00:00.000Z"
  eventTime: string; // "17:22"
  createdAt: string;
  updatedAt: string;
};

/* =====================
   View Modal
===================== */
export const formatTime12Hour = (time: string) => {
  if (!time) return "-";
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time;
  let hour = h % 12 || 12;
  let ampm = h < 12 ? "AM" : "PM";
  return `${hour.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")} ${ampm}`;
};

// const EventInfoModal: React.FC<{
//   event: EventType | null;
//   open: boolean;
//   onClose: () => void;
// }> = ({ event, open, onClose }) => (
//   <Modal open={open} onCancel={onClose} footer={null} centered width={600}>
//     {event && (
//       <>
//         <div style={{ textAlign: "center", marginBottom: 16 }}>
//           {event.image && (
//             <img
//               src={`${imageUrl}/${event.image}`}
//               alt={event.name}
//               style={{
//                 maxHeight: 180,
//                 objectFit: "cover",
//                 margin: "12px 0",
//                 maxWidth: "100%",
//                 borderRadius: 8,
//               }}
//             />
//           )}
//           <div style={{ fontSize: 20, color: "#555" }}>{event.name}</div>
//         </div>

//         <Descriptions column={1} bordered>
//           <Descriptions.Item label="Title">
//             {event.title}
//           </Descriptions.Item>
//           <Descriptions.Item label="Location">
//             {event.location}
//           </Descriptions.Item>
//           <Descriptions.Item label="Date">
//             {event.eventDate
//               ? dayjs(event.eventDate).format("DD MMM YYYY")
//               : "-"}
//           </Descriptions.Item>
//           <Descriptions.Item label="Time">
//             {event.eventTime ? formatTime12Hour(event.eventTime) : "-"}
//           </Descriptions.Item>
//           {!!event.description && (
//             <Descriptions.Item label="Description">
//               <div
//                 dangerouslySetInnerHTML={{
//                   __html: event.description,
//                 }}
//               />
//             </Descriptions.Item>
//           )}
//         </Descriptions>
//       </>
//     )}
//   </Modal>
// );

/* =====================
   Create / Edit Modal
===================== */
// const EventFormModal: React.FC<{
//   open: boolean;
//   loading: boolean;
//   editEvent: EventType | null;
//   onClose: () => void;
//   onAdd: (formData: FormData) => Promise<void>;
//   onUpdate: (id: string, formData: FormData) => Promise<void>;
// }> = ({ open, loading, editEvent, onClose, onAdd, onUpdate }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState<any[]>([]);
//   const [preview, setPreview] = useState<string | undefined>(undefined);
//   const [html, setHtml] = useState<string>("");

//   useEffect(() => {
//     if (editEvent) {
//       form.setFieldsValue({
//         name: editEvent.name,
//         title: editEvent.title,
//         location: editEvent.location,
//         eventDate: editEvent.eventDate
//           ? dayjs(editEvent.eventDate)
//           : undefined,
//         eventTime: editEvent.eventTime
//           ? dayjs(editEvent.eventTime, "HH:mm")
//           : undefined,
//       });
//       setHtml(editEvent.description || "");
//       if (editEvent.image) {
//         setPreview(editEvent.image);
//         setFileList([]);
//       }
//     } else {
//       setFileList([]);
//       setPreview(undefined);
//       form.resetFields();
//       setHtml("");
//     }
//     // eslint-disable-next-line
//   }, [editEvent, form]);

//   const handleSubmit = async () => {
//     const values = await form.validateFields();
//     const formData = new FormData();

//     for (const k of Object.keys(values)) {
//       if (k === "eventDate" && values[k]) {
//         formData.append("eventDate", values[k].startOf("day").toISOString());
//       } else if (k === "eventTime" && values[k]) {
//         formData.append("eventTime", values[k].format("HH:mm"));
//       }
//       else if (values[k]) {
//         formData.append(k, values[k]);
//       }
//     }
//     // Add description if present
//     if (html && html.trim()) {
//       formData.append("description", html);
//     } else {
//       // You can make this field required by adding validation if needed
//       formData.append("description", "");
//     }
//     if (fileList.length > 0 && fileList[0].originFileObj) {
//       formData.append("image", fileList[0].originFileObj);
//     }

//     if (editEvent) {
//       await onUpdate(editEvent._id, formData);
//     } else {
//       await onAdd(formData);
//     }
//     form.resetFields();
//     setFileList([]);
//     setPreview(undefined);
//     setHtml("");
//   };

//   return (
//     <Modal
//       open={open}
//       title={editEvent ? "Edit Event" : "Add Event"}
//       onCancel={onClose}
//       onOk={handleSubmit}
//       confirmLoading={loading}
//       okText={editEvent ? "Update" : "Create"}
//       width={600}
//       destroyOnClose
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           label="Name"
//           name="name"
//           rules={[{ required: true, message: "Please enter event name" }]}
//         >
//           <Input placeholder="Event name" />
//         </Form.Item>
//         <Form.Item
//           label="Title"
//           name="title"
//           rules={[{ required: true, message: "Please enter event title" }]}
//         >
//           <Input placeholder="Event title" />
//         </Form.Item>
//         <Form.Item
//           label="Location"
//           name="location"
//           rules={[{ required: true, message: "Please enter event location" }]}
//         >
//           <Input placeholder="Event location" />
//         </Form.Item>
//         <Form.Item
//           label="Date"
//           name="eventDate"
//           rules={[{ required: true, message: "Please enter event date" }]}
//         >
//           <DatePicker
//             style={{ width: "100%" }}
//             format="YYYY-MM-DD"
//             placeholder="Select date"
//           />
//         </Form.Item>
//         <Form.Item
//           label="Time"
//           name="eventTime"
//           rules={[{ required: true, message: "Please enter event time" }]}
//         >
//           <TimePicker
//             use12Hours
//             format="hh:mm A"
//             minuteStep={1}
//             style={{ width: "100%" }}
//             placeholder="Select time"
//           />
//         </Form.Item>
//         <Form.Item
//           label="Description"
//           required={false}
//           style={{ marginBottom: 24 }}
//         >
//           <Editor
//             value={html}
//             onChange={e => setHtml(e.target.value)}
//             aria-multiline
//             color="red"
//             style={{ color: "#fff", minHeight: 200, height: 200 }}
//             placeholder="Write Description"
//           />
//         </Form.Item>
//         <Form.Item label="Image">
//           <Upload
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
//             fileList={
//               fileList.length
//                 ? fileList
//                 : editEvent?.image
//                 ? [
//                     {
//                       uid: "-1",
//                       name: editEvent.image.split("/").pop() || "image.png",
//                       status: "done",
//                       url: imageUrl + "/" + editEvent.image,
//                     },
//                   ]
//                 : []
//             }
//             onChange={(info) => {
//               setFileList(info.fileList.slice(-1));
//             }}
//             listType="picture"
//             maxCount={1}
//           >
//             <Button icon={<UploadOutlined />}>Select Image</Button>
//           </Upload>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

/* =====================
   Main Page
===================== */
const Event: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [viewItem, setViewItem] = useState<EventType | null>(null);
  const [editItem, setEditItem] = useState<EventType | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading, refetch } = useGetEventsQuery({ query });
  const [createEvent, { isLoading: createLoading }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updateLoading }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: deleteLoading }] = useDeleteEventMutation();

  const columns: TableColumnsType<EventType> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        render: (src: string) =>
          src ? (
            <img
              src={`${imageUrl}/${src}`}
              alt="event"
              style={{
                height: 48,
                width: 48,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            <span style={{ color: "#ccc" }}>No image</span>
          ),
      },
      {
        title: "Name",
        dataIndex: "name",
        render: (v: string) => (
          <Text strong style={{ fontSize: 16 }}>
            {v}
          </Text>
        ),
      },
      {
        title: "Location",
        dataIndex: "location",
      },
      {
        title: "Event Date",
        dataIndex: "eventDate",
        render: (v: string) =>
          v ? dayjs(v).format("DD MMM YYYY") : "-",
      },
      {
        title: "Time",
        dataIndex: "eventTime",
        render: (v: string) =>
          v ? formatTime12Hour(v) : "-",
      },
      {
        title: "Registrations",
        dataIndex: "_id",
        render: (eventId: string, _: any) => (
          <Link
            to={`/event-registration?event=${eventId}`}
          >
            View
          </Link>
        ),
      },
      {
        title: "Total Registrations",
        dataIndex: "eventCount",
        align: "center",
        render: (count: number) => (
          <span>{typeof count === "number" ? count : "-"}</span>
        ),
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record) => (
          <Space>
            <Tooltip title="View">
              <Button
                type="link"
                style={{ color: "#2A62A6" }}
                onClick={() => {
                  setViewItem(record);
                  setViewOpen(true);
                }}
              >
                <EyeOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                type="link"
                style={{ color: "#2A62A6" }}
                onClick={() => {
                  setEditItem(record);
                  setFormOpen(true);
                }}
              >
                <FiEdit />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this event?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteEvent(record._id).unwrap();
                  message.success("Deleted");
                  refetch();
                }}
              >
                <Button type="link" danger style={{ color: "#e54848" }}>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [updateLoading, deleteLoading, page, limit]
  );

  const pagination: TablePaginationConfig = {
    total: data?.pagination?.total || 0,
    current: page,
    pageSize: limit,
    showSizeChanger: true,
    onChange: (p, s) => {
      setPage(p);
      setLimit(s);
    },
  };

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <EventInfoModal
          open={viewOpen}
          event={viewItem}
          onClose={() => setViewOpen(false)}
        />

        <EventFormModal
          open={formOpen}
          loading={createLoading || updateLoading}
          editEvent={editItem}
          onClose={() => {
            setFormOpen(false);
            setEditItem(null);
          }}
          onAdd={async (formData) => {
            await createEvent(formData).unwrap();
            message.success("Event added");
            setFormOpen(false);
            refetch();
          }}
          onUpdate={async (id, formData) => {
            await updateEvent({ id, data: formData }).unwrap();
            message.success("Event updated");
            setFormOpen(false);
            setEditItem(null);
            refetch();
          }}
        />

        {/* Top Actions */}
        <div>
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Input
              prefix={<FiSearch style={{ fontSize: 16, color: "#8c8c8c" }} />}
              type="text"
              placeholder="Search events"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ width: 350 }}
              size="large"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                height: 40,
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
              size="large"
              onClick={() => setFormOpen(true)}
            >
              Add Event
            </Button>
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading}>
          <Table
            rowKey="_id"
            style={{ overflowX: "auto", marginTop: 20 }}
            dataSource={data?.data || []}
            columns={columns}
            className="event-table-custom-gray event-table-gray-row-border"
            pagination={pagination}
            loading={isLoading}
            scroll={
              window.innerWidth < 600 ? undefined : { y: `calc(100vh - 320px)` }
            }
          />
        </Spin>
      </div>
    </EditorProvider>
  );
};

export default Event;
