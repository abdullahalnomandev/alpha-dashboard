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
  Progress
} from "antd";

import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import {
  useGetClubsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useDeleteClubMutation,
} from "../../redux/apiSlices/clubSlice";
import { imageUrl } from "../../redux/api/baseApi";
import { EditorProvider } from "react-simple-wysiwyg";
import { ClubInfoModal } from "./ClubInfoModel";
import { ClubFormModal } from "./ClubModel";

const { Text } = Typography;

/* =====================
   Types
===================== */
export type ClubType = {
  _id: string;
  name: string;
  image: string;
  limitOfMember: number;
  numberOfMembers: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

/* =====================
   Main Page
===================== */
const Club: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [viewItem, setViewItem] = useState<ClubType | null>(null);
  const [editItem, setEditItem] = useState<ClubType | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading, refetch } = useGetClubsQuery({ query });
  const [createClub, { isLoading: createLoading }] = useCreateClubMutation();
  const [updateClub, { isLoading: updateLoading }] = useUpdateClubMutation();
  const [deleteClub, { isLoading: deleteLoading }] = useDeleteClubMutation();

  const columns: TableColumnsType<ClubType> = useMemo(
    () => [
      {
        title: "Sl",
        dataIndex: "sl",
        key: "sl",
        align: "center",
        width: 64,
        render: (_: any, __: any, index: number) => {
          const serial = (page - 1) * limit + index + 1;
          return <span>#{serial < 10 ? `0${serial}` : serial}</span>;
        },
      },
      {
        title: "Image",
        dataIndex: "image",
        render: (src: string) =>
          src ? (
            <img
              src={`${imageUrl}${src}`}
              alt="club"
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
        title: "Members",
        dataIndex: "numberOfMembers",
        render: (current: number, record: ClubType) => {
          const percentage = record.limitOfMember > 0 ? (current / record.limitOfMember) * 100 : 0;
          return (
            <div style={{ width: 120 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>{current}/{record.limitOfMember}</span>
                <span style={{ fontSize: 12, color: '#666' }}>{Math.round(percentage)}%</span>
              </div>
              <Progress 
                percent={percentage} 
                size="small" 
                status={percentage >= 100 ? 'exception' : percentage >= 80 ? 'active' : 'normal'}
                showInfo={false}
              />
            </div>
          );
        },
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
                title="Delete this club?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteClub(record._id).unwrap();
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
        <ClubInfoModal
          open={viewOpen}
          club={viewItem}
          onClose={() => setViewOpen(false)}
        />

        <ClubFormModal
          open={formOpen}
          loading={createLoading || updateLoading}
          editClub={editItem}
          onClose={() => {
            setFormOpen(false);
            setEditItem(null);
          }}
          onAdd={async (formData) => {
            await createClub(formData).unwrap();
            message.success("Club added");
            setFormOpen(false);
            refetch();
          }}
          onUpdate={async (id, formData) => {
            await updateClub({ id, data: formData }).unwrap();
            message.success("Club updated");
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
              placeholder="Search clubs"
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
              Add Club
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

export default Club;
