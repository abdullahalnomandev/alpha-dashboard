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
  Switch,
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import {
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  useGetMembershipFeaturesQuery,
  useGetMembershipFeatureDetailsQuery,
  useCreateMembershipFeatureMutation,
  useUpdateMembershipFeatureMutation,
  useDeleteMembershipFeatureMutation,
} from "../../redux/apiSlices/membershipFeatureSlice";
import { imageUrl } from "../../redux/api/baseApi";
import { EditorProvider } from "react-simple-wysiwyg";
import { MemberShipFetureModal } from "./MemberShipFetureModal";

const { Text } = Typography;

export type MembershipFeatureType = {
  _id: string;
  icon: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const MemberShipFeatures: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal and selection state
  const [editId, setEditId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Query params
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // MembershipFeature hooks
  const { data, isLoading, refetch } = useGetMembershipFeaturesQuery({ query });
  const [createMembershipFeature, { isLoading: createLoading }] =
    useCreateMembershipFeatureMutation();
  const [updateMembershipFeature, { isLoading: updateLoading }] =
    useUpdateMembershipFeatureMutation();
  const [deleteMembershipFeature, { isLoading: deleteLoading }] =
    useDeleteMembershipFeatureMutation();


  const {
    data: editMembershipFeatureDetails,
    isLoading: editLoading,
  } = useGetMembershipFeatureDetailsQuery(editId!, {
    skip: !formOpen || !editId,
  });

  const columns: TableColumnsType<MembershipFeatureType> = useMemo(
    () => [
      {
        title: "Icon",
        dataIndex: "icon",
        key: "icon",
        render: (src: string) =>
          src ? (
            <img
              src={`${imageUrl}${src}`}
              alt="icon"
              style={{
                height: 40,
                width: 40,
                objectFit: "cover",
                borderRadius: 8,
                background: "#efefef",
              }}
            />
          ) : (
            <span style={{ color: "#ccc" }}>No icon</span>
          ),
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (v: string) => (
          <Text strong style={{ fontSize: 16 }}>
            {v}
          </Text>
        ),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        render: (v: string) => <span title={v}>{v}</span>,
      },
      {
        title: "Published",
        dataIndex: "isActive",
        key: "isActive",
        align: "center",
        render: (active: boolean, record: MembershipFeatureType) => (
          <Switch
            checked={!!active}
            onChange={async (checked) => {
              await updateMembershipFeature({
                id: record._id,
                data: { isActive: checked },
              }).unwrap();
              message.success(`Feature ${checked ? "activated" : "deactivated"}`);
              refetch();
            }}
          />
        ),
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record: MembershipFeatureType) => (
          <Space>
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
                title="Delete this Membership Feature?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteMembershipFeature(record._id).unwrap();
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
    [updateLoading, deleteLoading, page, limit, updateMembershipFeature, refetch, deleteMembershipFeature]
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

  // Format MembershipFeature data for table
  const formatMembershipFeatureData = (rawData: any[] = []) => {
    return rawData.map((feature) => ({
      _id: feature._id,
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      isActive: feature.isActive,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    }));
  };

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <MemberShipFetureModal
          open={formOpen}
          loading={createLoading || updateLoading || editLoading}
          editClub={
            isAddMode
              ? null
              : formOpen &&
                editMembershipFeatureDetails &&
                editMembershipFeatureDetails.data
              ? {
                  _id: editMembershipFeatureDetails.data._id,
                  title: editMembershipFeatureDetails.data.title,
                  description: editMembershipFeatureDetails.data.description,
                  image: editMembershipFeatureDetails.data.icon,
                  isActive: editMembershipFeatureDetails.data.isActive,
                }
              : null
          }
          onClose={() => {
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
          }}
          onAdd={async (formData) => {
            await createMembershipFeature(formData).unwrap();
            message.success("Feature added");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
            refetch();
          }}
          onUpdate={async (id, formData) => {
            await updateMembershipFeature({ id, data: formData }).unwrap();
            message.success("Feature updated");
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
              placeholder="Search membership features"
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
              Add Feature
            </Button>
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading}>
          <Table
            rowKey="_id"
            style={{ overflowX: "auto", marginTop: 20 }}
            dataSource={formatMembershipFeatureData(data?.data)}
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

export default MemberShipFeatures;
