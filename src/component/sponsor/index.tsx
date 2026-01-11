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
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  useGetSponsorsQuery,
  useGetSponsorDetailsQuery,
  useCreateSponsorMutation,
  useUpdateSponsorMutation,
  useDeleteSponsorMutation,
} from "../../redux/apiSlices/sponsors";
import { imageUrl } from "../../redux/api/baseApi";
import { EditorProvider } from "react-simple-wysiwyg";
import { SponsorModel } from "./SponsorModel";
import { SponsorInfoModel } from "./SponsorInfoModel";

const { Text } = Typography;

// =====================
// Types
// =====================
export type SponsorType = {
  _id: string;
  logo?: string;
  title: string;
  location?: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

/* =====================
   Main Page
===================== */
const Sponsor: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // For modal data
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Track modal key to force a remount for 'add' for clean form
  const [formModalKey, setFormModalKey] = useState<number>(0);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // API hooks from sponsors.ts
  const { data, isLoading, refetch } = useGetSponsorsQuery({ query });
  const [createSponsor, { isLoading: createLoading }] = useCreateSponsorMutation();
  const [updateSponsor, { isLoading: updateLoading }] = useUpdateSponsorMutation();
  const [deleteSponsor, { isLoading: deleteLoading }] = useDeleteSponsorMutation();

  // Get details for view modal
  const { data: sponsorDetails } = useGetSponsorDetailsQuery(viewId!, {
    skip: !viewOpen || !viewId,
  });

  // Get details for edit modal
  const {
    data: editSponsorDetails,
    isLoading: editLoading,
  } = useGetSponsorDetailsQuery(editId!, {
    skip: !formOpen || !editId || isAddMode,
  });

  const columns: TableColumnsType<SponsorType> = useMemo(
    () => [
      {
        title: "Logo",
        dataIndex: "logo",
        render: (src: string) =>
          src ? (
            <img
              src={`${imageUrl}${src}`}
              alt="sponsor"
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
        title: "Title",
        dataIndex: "title",
        render: (v: string) => (
          <Text strong style={{ fontSize: 16 }}>
            {v}
          </Text>
        ),
      },
      {
        title: "Location",
        dataIndex: "location",
        render: (v: string) =>
          v && v.trim().length > 0 ? v : <span style={{ color: "#aaa" }}>No location</span>,
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
                  setFormModalKey(prev => prev + 1); // re-render to keep edit form fresh if row changes
                }}
              >
                <FiEdit />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this sponsor?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteSponsor(record._id).unwrap();
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

  // Filter and format sponsor objects with necessary fields:
  const formatSponsorData = (rawData: any[] = []) => {
    return rawData.map((sponsor) => ({
      _id: sponsor._id,
      logo: sponsor.logo,
      title: sponsor.title,
      location: sponsor.location,
      description: sponsor.description,
      image: sponsor.image,
      createdAt: sponsor.createdAt,
      updatedAt: sponsor.updatedAt,
    }));
  };

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <SponsorInfoModel
          open={viewOpen}
          sponsor={
            viewOpen && sponsorDetails && sponsorDetails.data
              ? {
                  _id: sponsorDetails.data._id,
                  title: sponsorDetails.data.title,
                  location: sponsorDetails.data.location,
                  description: sponsorDetails.data.description,
                  logo: sponsorDetails.data.logo,
                }
              : null
          }
          onClose={() => {
            setViewOpen(false);
            setViewId(null);
          }}
        />

        <SponsorModel
          key={formModalKey}
          open={formOpen}
          loading={createLoading || updateLoading || editLoading}
          editSponsor={
            isAddMode
              ? null
              : formOpen && editSponsorDetails && editSponsorDetails.data
              ? (() => {
                  // sow log inserted image jsut
                  // This will log the image field if present, as per the spec
                  // eslint-disable-next-line no-console
                  console.log("Inserted image value just", editSponsorDetails.data.image);
                  return {
                    _id: editSponsorDetails.data._id,
                    title: editSponsorDetails.data.title,
                    location: editSponsorDetails.data.location,
                    logo: editSponsorDetails.data.logo,
                    image: editSponsorDetails.data.image,
                    description: editSponsorDetails.data.description,
                    createdAt: editSponsorDetails.data.createdAt,
                    updatedAt: editSponsorDetails.data.updatedAt,
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
            await createSponsor(formData).unwrap();
            message.success("Sponsor added");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
            refetch();
          }}
          onUpdate={async (id, formData) => {
            await updateSponsor({ id, formData }).unwrap();
            message.success("Sponsor updated");
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
              placeholder="Search sponsors"
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
              Add Sponsor
            </Button>
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading}>
          <Table
            rowKey="_id"
            style={{ overflowX: "auto", marginTop: 20 }}
            dataSource={formatSponsorData(data?.data)}
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

export default Sponsor;
