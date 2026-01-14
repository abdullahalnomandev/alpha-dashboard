import React, { useMemo, useState } from "react";
import {
  Table,
  Typography,
  Input,
  Button,
  Spin,
  Space,
  Tooltip,
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiSearch } from "react-icons/fi";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetUsersQuery} from "../../redux/apiSlices/userSlice";
import { UserInfoModal } from "./UserInfoModel";
import { imageUrl } from "../../redux/api/baseApi";
const { Text } = Typography;

/* =====================
   Types
===================== */
export type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  status: string;
  role: string;
  verified: boolean;
  application_form?: {
    _id: string;
    membershipType: string;
  };
  createdAt: string;
  updatedAt: string;
};

/* =====================
   Main Page
===================== */
const User: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [viewItem, setViewItem] = useState<UserType | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading } = useGetUsersQuery({ query });

  // Defensive handling: if rawData is not an array, convert or default to []
  const getUserArray = (rawData: any): UserType[] => {
    if (Array.isArray(rawData)) return rawData;
    if (rawData && typeof rawData === "object" && Array.isArray(rawData.data)) return rawData.data;
    return [];
  };

  const userList: UserType[] = React.useMemo(() => getUserArray(data?.data), [data]);

  const columns: TableColumnsType<UserType> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "profileImage",
        render: (src: string, _: UserType) => {
          let imageSrc = src;
          if (src && !src.startsWith("http")) {
            // imageUrl must be imported at the top: import { imageUrl } from "../../redux/api/baseApi";
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
        title: "Role",
        dataIndex: "role",
        render: (role: string) => (
          <span style={{ textTransform: "capitalize" }}>{role}</span>
        ),
      },
      {
        title: "Membership",
        dataIndex: ["application_form", "membershipType"],
        render: (_: any, record: UserType) =>
          record.application_form?.membershipType
            ? record.application_form.membershipType.replace(/_/g, " ")
            : "-",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (v: string) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
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
    [page, limit]
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
    <div>
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
        </div>
      </div>

      {/* Table */}
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
            window.innerWidth < 600 ? undefined : { y: `calc(100vh - 320px)` }
          }
        />
      </Spin>
      <UserInfoModal user={viewItem} open={viewOpen} onClose={() => setViewOpen(false)} />
    </div>
  );
};

export default User;
