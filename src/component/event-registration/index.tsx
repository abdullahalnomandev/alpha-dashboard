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
  Tooltip,
  Select,
} from "antd";

import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiSearch } from "react-icons/fi";
import {
  DeleteOutlined,
} from "@ant-design/icons";

import {
  useGetEventRegistrationsQuery,
  useGetEventRegistrationDetailsQuery,
  useDeleteEventRegistrationMutation,
  useUpdateEventRegistrationMutation,
} from "../../redux/apiSlices/event-registrationSlice";
import { EditorProvider } from "react-simple-wysiwyg";
import { EventRegistrationInfoModal } from "./EventRegistrationInfoModal";

const { Text } = Typography;

/* =====================
   Types
===================== */
export type EventRegistrationType = {
  _id: string;
  user: {
    _id: string;
    name: string;
    profileImage: string;
    email: string;
    phone: string;
    status: string;
    role: string;
    verified: boolean;
    hasPasswordSave: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  event: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

/* =====================
   Main Page
===================== */
const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

const EventRegistrationPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // For modal data
  const [viewId, setViewId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // API hooks from event-registrationSlice
  const { data, isLoading, refetch } = useGetEventRegistrationsQuery({ query });
  const [deleteEventRegistration, { isLoading: deleteLoading }] =
    useDeleteEventRegistrationMutation();
  const [updateEventRegistration, { isLoading: updateLoading }] =
    useUpdateEventRegistrationMutation();

  // Get details for view modal
  const { data: registrationDetails } = useGetEventRegistrationDetailsQuery(viewId!, {
    skip: !viewOpen || !viewId,
  });

  const handleStatusUpdate = async (record: EventRegistrationType, newStatus: string) => {
    try {
      await updateEventRegistration({
        id: record._id,
        data: { status: newStatus },
      }).unwrap();
      message.success("Status updated");
      refetch();
    } catch (err) {
      message.error("Failed to update status");
    }
  };

  const columns: TableColumnsType<EventRegistrationType> = useMemo(
    () => [
      {
        title: "Sl#",
        dataIndex: "sl",
        key: "sl",
        align: "center",
        width: 64,
        render: (_: any, __: any, index: number) => {
          const serial = (page - 1) * limit + index + 1;
          return <span>{serial < 10 ? `0${serial}` : serial}</span>;
        },
      },
      {
        title: "User Name",
        dataIndex: ["user", "name"],
        render: (_: any, record: EventRegistrationType) => (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={record.user?.profileImage}
              alt={record.user?.name}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 6,
              }}
            />
            <span>
              <Text strong style={{ fontSize: 16 }}>
                {record.user?.name}
              </Text>
            </span>
          </div>
        ),
      },
      {
        title: "User Email",
        dataIndex: ["user", "email"],
        render: (_: string, record: EventRegistrationType) => (
          <span style={{ color: "#2A62A6" }}>{record.user.email}</span>
        ),
      },
      {
        title: "User Phone",
        dataIndex: ["user", "phone"],
        render: (_: string, record: EventRegistrationType) => (
          <span>{record.user.phone}</span>
        ),
      },
      {
        title: "Event",
        dataIndex: "event",
        render: (event: string) => (
          <span>{event}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (status: string, record: EventRegistrationType) => {
          return (
            <span>
              {record.status === "pending" ? (
                <Select
                  style={{ minWidth: 120 }}
                  value={status}
                  size="small"
                  onChange={(value) => handleStatusUpdate(record, value)}
                  disabled={updateLoading}
                  options={statusOptions}
                />
              ) : (
                <span
                  style={{
                    color:
                      status === "confirmed"
                        ? "#388e3c"
                        : status === "cancelled"
                        ? "#e53935"
                        : "#a0830b",
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              )}
            </span>
          );
        },
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (createdAt: string) => {
          const d = new Date(createdAt);
          const day = d.getDate();
          const month = d.toLocaleString("default", { month: "short" });
          const year = d.getFullYear();
          const hours = d.getHours().toString().padStart(2, "0");
          const minutes = d.getMinutes().toString().padStart(2, "0");
          return (
            <span>
              {`${day} ${month} ${year}, ${hours}:${minutes}`}
            </span>
          );
        },
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record: EventRegistrationType) => (
          <Space>
            {/* <Tooltip title="View">
              <Button
                type="link"
                style={{ color: "#2A62A6" }}
                onClick={() => {
                  setViewId(record._id);
                  setViewOpen(true);
                }}
              >
                <EyeOutlined />
              </Button>
            </Tooltip> */}
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this registration?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteEventRegistration(record._id).unwrap();
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
    [deleteLoading, page, limit, updateLoading]
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

  // Format and filter event registration data for table
  const formatRegistrationData = (rawData: any[] = []) => {
    return rawData.map((form) => ({
      _id: form._id,
      user: form.user,
      event: form.event,
      status: form.status,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    }));
  };

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <EventRegistrationInfoModal
          open={viewOpen}
          registration={
            viewOpen &&
            registrationDetails &&
            registrationDetails.data
              ? registrationDetails.data
              : null
          }
          onClose={() => {
            setViewOpen(false);
            setViewId(null);
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
              placeholder="Search event registrations"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ width: 350 }}
              size="large"
            />
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading}>
          <Table
            rowKey="_id"
            style={{ overflowX: "auto", marginTop: 20 }}
            dataSource={formatRegistrationData(data?.data)}
            columns={columns as any}
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

export default EventRegistrationPage;
