import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  Typography,
  Input,
  Button,
  Space,
  Tooltip,
  Select,
  message,
  Spin
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiSearch } from "react-icons/fi";
import { EyeOutlined, CheckSquareOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetUsersQuery, useUpdateSingleUserMutation } from "../../redux/apiSlices/userSlice";
import { UserInfoModal } from "./UserInfoModel";
import { imageUrl } from "../../redux/api/baseApi";
import SendMessageModal from "./SendMessageModal";
const { Text } = Typography;
const { Option } = Select;

export type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  status: "active" | "block";
  role: "admin" | "user";
  verified: boolean;
  application_form?: {
    _id: string;
    membershipType: string;
  };
  createdAt: string;
  updatedAt: string;
};

const User: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);

  const [viewItem, setViewItem] = useState<UserType | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [localUserRole, setLocalUserRole] = useState<Record<string, UserType["role"]>>({});
  const [localUserStatus, setLocalUserStatus] = useState<Record<string, UserType["status"]>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading } = useGetUsersQuery({ query });
  const [updateSingleUser, { isLoading: isUpdating }] = useUpdateSingleUserMutation();

  const getUserArray = (rawData: any): UserType[] => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && typeof rawData === "object" && Array.isArray(rawData.data)) return rawData.data;
    return [];
  };

  const userList: UserType[] = useMemo(() => getUserArray(data?.data), [data]);

  // Save local role/status instantly and update backend
  const handleInstantRoleChange = async (id: string, newRole: UserType["role"]) => {
    setLocalUserRole(prev => ({ ...prev, [id]: newRole }));
    try {
      const formData = new FormData();
      formData.append("role", newRole);
      await updateSingleUser({ id, formData }).unwrap();
      message.success("User role updated.");
    } catch (e: any) {
      message.error(e?.data?.message || e?.message || "Update failed");
    }
  };

  const handleInstantStatusChange = async (id: string, newStatus: UserType["status"]) => {
    setLocalUserStatus(prev => ({ ...prev, [id]: newStatus }));
    try {
      const formData = new FormData();
      formData.append("status", newStatus);
      await updateSingleUser({ id, formData }).unwrap();
      message.success("User status updated.");
    } catch (e: any) {
      message.error(e?.data?.message || e?.message || "Update failed");
    }
  };

  // Table columns
  const columns: TableColumnsType<UserType> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "profileImage",
        render: (src: string, _: UserType) => {
          let imageSrc = src;
          if (src && !src.startsWith("http")) {
            imageSrc = imageUrl + src;
          }
          return src ? (
            <img
              src={imageSrc}
              alt="profile"
              style={{
                height: 48,
                width: 48,
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
          ) : (
            <span style={{ color: "#ccc" }}>No image</span>
          );
        },
      },
      {
        title: "Name",
        dataIndex: "name",
        render: (v: string) => (
          <Text strong style={{ fontSize: 16 }}>{v}</Text>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (v: string) => <span>{v}</span>,
      },
      {
        title: "Phone",
        dataIndex: "phone",
      },
      {
        title: "Membership",
        dataIndex: ["application_form", "membershipType"],
        render: (_: any, record: UserType) =>
          record.application_form?.membershipType
            ? record.application_form.membershipType?.replace(/_/g, " ")
            : "-",
      },
      {
        title: "Created Date",
        dataIndex: "createdAt",
        render: (v: string) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
      },
      {
        title: "Role",
        dataIndex: "role",
        render: (_role: string, record: UserType) => {
          return (
            <Select
              value={localUserRole[record._id] ?? record.role}
              style={{ minWidth: 90 }}
              onChange={newRole => handleInstantRoleChange(record._id, newRole as "admin" | "user")}
              disabled={isUpdating}
              size="small"
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (_status: string, record: UserType) => {
          return (
            <Select
              value={localUserStatus[record._id] ?? record.status}
              style={{ minWidth: 90 }}
              onChange={newStatus => handleInstantStatusChange(record._id, newStatus as "active" | "block")}
              disabled={isUpdating}
              size="small"
            >
              <Option value="active">
                <span style={{ color: "green" }}>Active</span>
              </Option>
              <Option value="block">
                <span style={{ color: "red" }}>Blocked</span>
              </Option>
            </Select>
          );
        },
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record: UserType) => (
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
          </Space>
        ),
      },
    ],
    [page, limit, isUpdating, localUserRole, localUserStatus]
  );


  const pagination: TablePaginationConfig = {
    total: data?.data?.pagination?.total || 0,
    current: page,
    pageSize: limit,
    showSizeChanger: true,
    onChange: (p, s) => {
      setPage(p);
      setLimit(s);
    },
  };

  // Table rowSelection with checkmarks (and Select All)
  const rowSelection = {
    selectedRowKeys,
    columnPosition: 'left' as const,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // Whether to show action flex (right side for selected)
  const showBulkActions = selectedRowKeys.length > 0;

  // Modal handlers
  const onMessageSend = () => {
    console.log("Message to users", selectedRowKeys, messageText);
    message.success("Message send logic will be implemented later!");
    setMessageModalOpen(false);
    setMessageText("");
  };
  const onMessageCancel = () => {
    setMessageModalOpen(false);
    setMessageText("");
  };

  // If our page is out of bounds
  useEffect(() => {
    const total = data?.data?.pagination?.total || data?.total || 0;
    const maxPage = Math.max(1, Math.ceil(total / limit));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [data, limit, page]);


  return (
    <div>
      {/* Top Actions */}
      <div>
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: showBulkActions ? 16 : 0,
          }}
        >
          <Input
            prefix={<FiSearch style={{ fontSize: 16, color: "#8c8c8c" }} />}
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            allowClear
            style={{ width: 350 }}
            size="large"
          />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              type="primary"
              icon={<CheckSquareOutlined />}
              onClick={() => setMessageModalOpen(true)}
              size="large"
              // disabled={!isMessageButtonEnabled}
              style={{
                // opacity: isMessageButtonEnabled ? 1 : 0.5,
                // cursor: isMessageButtonEnabled ? 'pointer' : 'not-allowed',
                transition: "opacity 0.2s"
              }}
            >
             Send Notification
            </Button>
          </div>
        </div>
      </div>
      <Spin spinning={isLoading}>
        <Table
          rowKey="_id"
          style={{ overflowX: "auto", marginTop: 20 }}
          dataSource={userList}
          columns={columns}
          className="event-table-custom-gray event-table-gray-row-border"
          pagination={pagination}
          loading={isLoading}
          scroll={
            typeof window !== "undefined" && window.innerWidth < 600
              ? undefined
              : { y: `calc(100vh - 320px)` }
          }
          rowSelection={rowSelection}
        />
      </Spin>
      <UserInfoModal user={viewItem} open={viewOpen} onClose={() => setViewOpen(false)} />
      <SendMessageModal
        open={messageModalOpen}
        loading={isUpdating}
        messageText={messageText}
        setMessageText={setMessageText}
        selectedUsers={userList.filter(u => selectedRowKeys.includes(u._id))}
        onOk={onMessageSend}
        onCancel={onMessageCancel}
      />
    </div>
  );
};

export default User;
