import React, { useMemo, useState, useEffect } from "react";
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
import { FiSearch, FiEye } from "react-icons/fi";
import { DeleteOutlined } from "@ant-design/icons";

import {
  useGetEventRegistrationsQuery,
  useGetEventRegistrationDetailsQuery,
  useDeleteEventRegistrationMutation,
  useUpdateEventRegistrationMutation,
} from "../../redux/apiSlices/event-registrationSlice";
import { EditorProvider } from "react-simple-wysiwyg";
import { EventRegistrationInfoModal } from "./EventRegistrationInfoModal";
import { useGetEventsQuery } from "../../redux/apiSlices/eventSlice";
import { imageUrl } from "../../redux/api/baseApi";

const { Text } = Typography;

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
const STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

// Helper to get query param from URL
function getEventIdFromLocation(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const eId = params.get("event");
  return eId ?? undefined;
}

const EventRegistrationPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // EventId is dynamic based on ?event=event_id URL param by default
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  // On initial mount, if eventId exists in the URL, set it
  useEffect(() => {
    const initialEventId = getEventIdFromLocation();
    if (initialEventId) setEventId(initialEventId);
  }, []);

  // Query params for pagination and search and event filter
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;
  if (eventId) query.event = eventId;

  // Get events for select options
  const { data: eventsData, isLoading: isEventsLoading } = useGetEventsQuery(
    {}
  );

  // API hooks from event-registrationSlice
  const { data, isLoading, refetch } = useGetEventRegistrationsQuery({ query });
  const [deleteEventRegistration, { isLoading: deleteLoading }] =
    useDeleteEventRegistrationMutation();
  const [updateEventRegistration, { isLoading: updateLoading }] =
    useUpdateEventRegistrationMutation();

  // For modal data
  const [viewItem, setViewItem] = useState<EventRegistrationType | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Get details for view modal
  const { data: registrationDetails } = useGetEventRegistrationDetailsQuery(
    viewItem?._id ?? "",
    {
      skip: !viewOpen || !viewItem,
    }
  );

  // Lookup for event name by ID
  const eventIdToName: Record<string, string> = useMemo(() => {
    if (!eventsData || !Array.isArray(eventsData.data)) return {};
    const map: Record<string, string> = {};
    for (const event of eventsData.data) {
      map[event._id] = event.name || event.title || event._id;
    }
    return map;
  }, [eventsData]);

  const handleStatusUpdate = async (
    record: EventRegistrationType,
    decision: "confirm" | "cancel"
  ) => {
    let newStatus: "confirmed" | "cancelled" =
      decision === "confirm" ? "confirmed" : "cancelled";
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
              src={
                record.user?.profileImage
                  ? record.user.profileImage.startsWith("http") ||
                    record.user.profileImage.startsWith("https")
                    ? record.user.profileImage
                    : imageUrl + record.user.profileImage
                  : undefined
              }
              alt={record.user?.name || "profile"}
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
        render: (event: string) => <span>{eventIdToName[event] || event}</span>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "center",
        render: (status: string, record: EventRegistrationType) => {
          if (record.status === STATUS.PENDING) {
            return (
              <Space>
                <Tooltip title="Confirm registration">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleStatusUpdate(record, "confirm")}
                    loading={updateLoading}
                    style={{
                      background: "#52c41a",
                      borderColor: "#52c41a",
                      boxShadow: "0 2px 10px rgba(82,196,26,0.10)",
                    }}
                  >
                    Confirm
                  </Button>
                </Tooltip>
                <Tooltip title="Cancel registration">
                  <Button
                    type="primary"
                    size="small"
                    danger
                    onClick={() => handleStatusUpdate(record, "cancel")}
                    loading={updateLoading}
                    style={{ boxShadow: "0 2px 10px rgba(245,34,45,0.10)" }}
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </Space>
            );
          } else {
            return (
              <span
                style={{
                  color:
                    status === STATUS.CONFIRMED
                      ? "#388e3c"
                      : status === STATUS.CANCELLED
                      ? "#e53935"
                      : "#a0830b",
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {statusLabels[status] || status}
              </span>
            );
          }
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
          return <span>{`${day} ${month} ${year}, ${hours}:${minutes}`}</span>;
        },
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record: EventRegistrationType) => (
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
                <FiEye />
              </Button>
            </Tooltip>
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
    [deleteLoading, page, limit, updateLoading, eventIdToName]
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

  // Prepare event select options
  const eventOptions =
    eventsData && Array.isArray(eventsData.data)
      ? eventsData.data.map((event: any) => ({
          value: event._id,
          label: event.name || event.title || event._id,
        }))
      : [];

  // Prepare registration for info modal - ensure user is included
  let infoModalRegistration = null;
  if (viewOpen && registrationDetails && registrationDetails.data) {
    // If registrationDetails.data.user exists, use as is, else fallback to viewItem's user
    const reg = registrationDetails.data;
    infoModalRegistration = {
      ...reg,
      user: reg.user || viewItem?.user, // fallback just in case user missing from details
    };
  } else if (viewOpen && viewItem) {
    // fallback: if we are open and no loaded details, pass in item from table
    infoModalRegistration = viewItem;
  }

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <EventRegistrationInfoModal
          open={viewOpen}
          registration={infoModalRegistration}
          onClose={() => {
            setViewOpen(false);
            setViewItem(null);
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
            {/* Left side: Search */}
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

            {/* Right side: Select */}
            <Select
              placeholder="Filter by event"
              loading={isEventsLoading}
              size="large"
              allowClear
              style={{ minWidth: 200 }}
              value={eventId}
              options={eventOptions}
              onChange={(val) => {
                setEventId(val);
                setPage(1);
              }}
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
              typeof window !== "undefined" && window.innerWidth < 600
                ? undefined
                : { y: `calc(100vh - 320px)` }
            }
          />
        </Spin>
      </div>
    </EditorProvider>
  );
};

export default EventRegistrationPage;
