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
