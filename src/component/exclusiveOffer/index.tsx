import React, { useMemo, useState, useCallback } from "react";
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
  Switch,
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { EditorProvider } from "react-simple-wysiwyg";
import { ExclusiveOfferInfoModal } from "./ExclusiveOfferInfoModal";
import { ExclusiveOfferModel } from "./ExclusiveOfferModel";
import {
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useGetOffersQuery,
  useUpdateOfferMutation,
} from "../../redux/apiSlices/exclusiveOfferSlice";
import { imageUrl } from "../../redux/api/baseApi";

const { Text } = Typography;

export type ExclusiveOfferType = {
  _id: string;
  name: string;
  title: string;
  discount: {
    enable: boolean;
    value: number;
  };
  category: {
    _id: string;
    name: string;
  };
  isFavourite?: boolean;
  [key: string]: any;
};

const ExclusiveOffer: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [viewItem, setViewItem] = useState<ExclusiveOfferType | null>(null);
  const [editItem, setEditItem] = useState<ExclusiveOfferType | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Whether we're in "add" or "edit" mode for the model
  const [isAddMode, setIsAddMode] = useState<boolean>(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading, refetch } = useGetOffersQuery({ query });
  const [createExclusiveOffer, { isLoading: createLoading }] =
    useCreateOfferMutation();
  const [updateExclusiveOffer, { isLoading: updateLoading }] =
    useUpdateOfferMutation();
  const [deleteExclusiveOffer, { isLoading: deleteLoading }] =
    useDeleteOfferMutation();

  // Toggle enable/disable discount
  const handleToggleDiscount = useCallback(
    async (record: ExclusiveOfferType, checked: boolean) => {
      try {
        // Must use FormData as per ExclusiveOfferInfoModal/Model
        const formData = new FormData();
        formData.append("name", record.name);
        formData.append("title", record.title);
        formData.append("category", record.category._id);
        formData.append("isFavourite", record.isFavourite ? "true" : "false");
        // Discount
        formData.append("discount[enable]", String(checked));
        formData.append(
          "discount[value]",
          checked ? String(record.discount.value || 0) : "0"
        );

        if ("description" in record) {
          // Some API responses might not include description, be permissive
          formData.append(
            "description",
            (record as any).description || ""
          );
        }

        // If editItem may have .image and it is a string, try passing as current image if needed
        if ((record as any).image && typeof (record as any).image === "string") {
          formData.append("image", (record as any).image);
        }

        await updateExclusiveOffer({ id: record._id, formData }).unwrap();
        message.success(
          `Discount ${checked ? "enabled" : "disabled"}`
        );
        refetch();
      } catch (e) {
        message.error("Failed to update discount status");
      }
    },
    [updateExclusiveOffer, refetch]
  );

  const columns: TableColumnsType<ExclusiveOfferType> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        render: (src: string, _) =>
          src ? (
            <img
              src={
                src.startsWith("http") ? src : `${imageUrl}/${src?.replace(/^\/+/, "")}`
              }
              alt="image"
              style={{
                height: 48,
                width: 48,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            <span style={{ color: "#ccc" }}>No logo</span>
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
        title: "Category",
        dataIndex: ["category", "name"],
        render: (_: string, record: ExclusiveOfferType) =>
          record.category?.name || "-",
      },
      {
        title: "Enable Discount",
        dataIndex: ["discount", "enable"],
        align: "center",
        render: (_: boolean, record: ExclusiveOfferType) => (
          <Switch
            checked={!!record.discount?.enable}
            onChange={(checked) => handleToggleDiscount(record, checked)}
            disabled={updateLoading}
          />
        ),
      },
      {
        title: "Discount (%)",
        dataIndex: ["discount", "value"],
        align: "center",
        render: (_: any, record: ExclusiveOfferType) =>
          record.discount?.enable ? (
            <span>{record.discount.value}%</span>
          ) : (
            <span style={{ color: "#bbb" }}>N/A</span>
          ),
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record: ExclusiveOfferType) => (
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
                  setIsAddMode(false);
                  setFormOpen(true);
                }}
              >
                <FiEdit />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this exclusive offer?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteExclusiveOffer(record._id).unwrap();
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
    [updateLoading, deleteLoading, page, limit, handleToggleDiscount, refetch]
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

  // Handler for closing form modal/model
  const handleFormClose = () => {
    setFormOpen(false);
    setEditItem(null);
    setIsAddMode(false);
  };

  // Handler for closing the info (view) modal
  const handleViewClose = () => {
    setViewOpen(false);
    setViewItem(null);
  };

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <ExclusiveOfferInfoModal
          open={viewOpen}
          data={viewItem}
          onClose={handleViewClose}
        />

        <ExclusiveOfferModel
          open={formOpen}
          editEvent={isAddMode ? null : editItem}
          loading={createLoading || updateLoading}
          onClose={handleFormClose}
          onAdd={async (formData: FormData) => {
            await createExclusiveOffer(formData).unwrap();
            message.success("Exclusive offer added");
            setFormOpen(false);
            setIsAddMode(false);
            refetch();
          }}
          onUpdate={async (id: string, formData: FormData) => {
            await updateExclusiveOffer({ id, formData }).unwrap();
            message.success("Exclusive offer updated");
            setFormOpen(false);
            setEditItem(null);
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
              flexWrap: "wrap",
            }}
          >
            <Input
              prefix={<FiSearch style={{ fontSize: 16, color: "#8c8c8c" }} />}
              type="text"
              placeholder="Search exclusive offers"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ width: 350, maxWidth: "100%" }}
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
                setIsAddMode(true);
                setEditItem(null);
                setFormOpen(true);
              }}
            >
              Add Exclusive Offer
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
              window.innerWidth < 600
                ? undefined
                : { y: `calc(100vh - 320px)` }
            }
          />
        </Spin>
      </div>
    </EditorProvider>
  );
};

export default ExclusiveOffer;
