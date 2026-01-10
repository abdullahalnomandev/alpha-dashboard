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
  useGetClubDetailsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useDeleteClubMutation,
} from "../../redux/apiSlices/clubSlice";
import { imageUrl } from "../../redux/api/baseApi";
import { EditorProvider } from "react-simple-wysiwyg";
import { ClubInfoModel } from "./ClubInfoModel";
import { ClubModel } from "./ClubModel";

const { Text } = Typography;

/* =====================
   Types
===================== */
export type ClubType = {
  _id: string;
  image: string;
  name: string;
  limitOfMember: number;
  numberOfMembers: number;
  location?: string;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/* =====================
   Main Page
===================== */
const Club: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // For modal data
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // NEW: tracks add mode

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // API hooks from clubSlice.ts
  const { data, isLoading, refetch } = useGetClubsQuery({ query });
  const [createClub, { isLoading: createLoading }] = useCreateClubMutation();
  const [updateClub, { isLoading: updateLoading }] = useUpdateClubMutation();
  const [deleteClub, { isLoading: deleteLoading }] = useDeleteClubMutation();

  // Get details for view modal
  const {  data: clubDetails } = useGetClubDetailsQuery(viewId!, {
    skip: !viewOpen || !viewId
  });

  // Get details for edit modal
  const {
    data: editClubDetails,
    isLoading: editLoading
  } = useGetClubDetailsQuery(editId!, {
    skip: !formOpen || !editId
  });

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
        render: (_: number, record: ClubType) => {
          return (
            <span>
               {record.limitOfMember < 10 ? `0${record.limitOfMember}` : record.limitOfMember}
            </span>
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
                  setViewId(record._id);
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
                  setEditId(record._id);
                  setIsAddMode(false);
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

  // Filter to only display club objects with necessary fields:
  const formatClubData = (rawData: any[] = []) => {
    return rawData.map((club) => ({
      _id: club._id,
      image: club.image,
      name: club.name,
      limitOfMember: club.limitOfMember,
      numberOfMembers: club.numberOfMembers,
      location: club.location,
      description: club.description,
      active: club.active,
      createdAt: club.createdAt,
      updatedAt: club.updatedAt,
    }));
  };

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <ClubInfoModel
          open={viewOpen}
          club={
            viewOpen && clubDetails && clubDetails.data
              ? {
                  _id: clubDetails.data._id,
                  image: clubDetails.data.image,
                  name: clubDetails.data.name,
                  limitOfMember: clubDetails.data.limitOfMember,
                  numberOfMembers: clubDetails.data.numberOfMembers,
                  location: clubDetails.data.location,
                  description: clubDetails.data.description,
                }
              : null
          }
          onClose={() => {
            setViewOpen(false);
            setViewId(null);
          }}
        />

        <ClubModel
          open={formOpen}
          loading={createLoading || updateLoading || editLoading}
          editClub={
            isAddMode
              ? null
              : formOpen && editClubDetails && editClubDetails.data
              ? {
                  _id: editClubDetails.data._id,
                  name: editClubDetails.data.name,
                  location: editClubDetails.data.location,
                  image: editClubDetails.data.image,
                  limitOfMember: editClubDetails.data.limitOfMember,
                  numberOfMembers: editClubDetails.data.numberOfMembers,
                  description: editClubDetails.data.description,
                }
              : null
          }
          onClose={() => {
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
          }}
          onAdd={async (formData) => {
            await createClub(formData).unwrap();
            message.success("Club added");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
            refetch();
          }}
          onUpdate={async (id, formData) => {
            await updateClub({ id, data: formData }).unwrap();
            message.success("Club updated");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
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
              onClick={() => {
                setFormOpen(true);
                setEditId(null);
                setIsAddMode(true);
              }}
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
            dataSource={formatClubData(data?.data)}
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
