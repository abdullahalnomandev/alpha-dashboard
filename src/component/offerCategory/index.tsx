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
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  useGetOfferCategoriesQuery,
  useGetOfferCategoryDetailsQuery,
  useCreateOfferCategoryMutation,
  useUpdateOfferCategoryMutation,
  useDeleteOfferCategoryMutation,
} from "../../redux/apiSlices/offerCategorySlice";
import { EditorProvider } from "react-simple-wysiwyg";
import { OfferCategoryModal } from "./offerCategoryModel";
const { Text } = Typography;

// Only show _id, name, createdAt, updatedAt in rows
export type OfferCategoryType = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

const OfferCategory: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // For modal data
  const [editId, setEditId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Track modal key to force a remount for 'add' for clean form
  const [formModalKey, setFormModalKey] = useState<number>(0);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // API hooks from offerCategorySlice.ts
  const { data, isLoading, refetch } = useGetOfferCategoriesQuery({ query });
  const [createOfferCategory, { isLoading: createLoading }] = useCreateOfferCategoryMutation();
  const [updateOfferCategory, { isLoading: updateLoading }] = useUpdateOfferCategoryMutation();
  const [deleteOfferCategory, { isLoading: deleteLoading }] = useDeleteOfferCategoryMutation();

  // Get details for edit modal
  const {
    data: editCategoryDetails,
    isLoading: editLoading,
  } = useGetOfferCategoryDetailsQuery(editId!, {
    skip: !formOpen || !editId || isAddMode,
  });

  // Columns: SL #1, name, createdAt, Action
  const columns: TableColumnsType<OfferCategoryType> = useMemo(
    () => [
      {
        title: "SL #",
        dataIndex: "sl",
        render: (_: any, __: any, index: number) =>
          (page - 1) * limit + index + 1,
        width: 70,
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
        title: "Created At",
        dataIndex: "createdAt",
        render: (v: string) => v ? new Date(v).toLocaleString() : "-",
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record) => (
          <Space>
            <Tooltip title="Edit">
              <Button
                type="link"
                style={{ color: "#2A62A6" }}
                onClick={() => {
                  setEditId(record._id);
                  setIsAddMode(false);
                  setFormOpen(true);
                  setFormModalKey(prev => prev + 1); // re-render to keep edit form fresh if row changes
                }}
              >
                <FiEdit />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this category?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteOfferCategory(record._id).unwrap();
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

  // Only map required fields: _id, name, createdAt, updatedAt.
  const formatCategoryData = (rawData: any[] = []) => {
    return rawData.map((category) => ({
      _id: category._id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  };

  return (
    <EditorProvider>
      <div>
        {/* Add/Update Modal */}
        <OfferCategoryModal
          key={formModalKey}
          open={formOpen}
          loading={createLoading || updateLoading || editLoading}
          editSponsor={
            isAddMode
              ? null
              : formOpen && editCategoryDetails && editCategoryDetails.data
              ? (() => {
                  return {
                    _id: editCategoryDetails.data._id,
                    name: editCategoryDetails.data.name,
                    createdAt: editCategoryDetails.data.createdAt,
                    updatedAt: editCategoryDetails.data.updatedAt,
                  };
                })()
              : null
          }
          onClose={() => {
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
          }}
          onAdd={async (formData) => {
            await createOfferCategory(formData as any).unwrap();
            message.success("Category added");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
            refetch();
          }}
          onUpdate={async (id: any, formData: any) => {
            await updateOfferCategory({ id, formData }).unwrap();
            message.success("Category updated");
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
              placeholder="Search categories"
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
                setFormOpen(false);
                setTimeout(() => {
                  setIsAddMode(true);
                  setEditId(null);
                  setFormModalKey(prev => prev + 1);
                  setFormOpen(true);
                }, 0);
              }}
            >
              Add Category
            </Button>
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading}>
          <Table
            rowKey="_id"
            style={{ overflowX: "auto", marginTop: 20 }}
            dataSource={formatCategoryData(data?.data)}
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

export default OfferCategory;
