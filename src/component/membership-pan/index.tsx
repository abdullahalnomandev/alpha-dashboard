import React, { useMemo, useState } from "react";
import {
  Table,
  Typography,
  Input,
  Button,
  Spin,
  message,
  Switch,
  Space,
  Tooltip,
  Popconfirm,
} from "antd";

import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";

import {
  useGetMembershipPlansQuery,
  useCreateMembershipPlanMutation,
  useUpdateMembershipPlanMutation,
  useDeleteMembershipPlanMutation,
} from "../../redux/apiSlices/membershipPlanSlice";
import { EditorProvider } from "react-simple-wysiwyg";
import { MemberShipPlanModalInfo } from "./MemberShipPlanModelInfo";
import { MemberShipPlanModel } from "./MemberShipPlanModel";

const { Text } = Typography;

/* =====================
   Types
===================== */
type MembershipFeature = {
  _id: string;
  icon: string;
  title: string;
  description: string;
};

type FamilyMembershipOptions = {
  enableFamilyMembers: boolean;
  familyMembershipLimit?: number;
};

export type MembershipPlanType = {
  _id: string;
  membershipType: string;
  image?: string; // updated to image for consistency with modal
  title: string;
  description?: string;
  subDescription?: string;
  features?: MembershipFeature[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  familyMembershipOptions?: FamilyMembershipOptions;
};

const MemberShipPlan: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [viewItem, setViewItem] = useState<MembershipPlanType | null>(null);
  const [editItem, setEditItem] = useState<MembershipPlanType | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading, refetch } = useGetMembershipPlansQuery({ query });
  const [createPlan, { isLoading: createLoading }] = useCreateMembershipPlanMutation();
  const [updatePlan, { isLoading: updateLoading }] = useUpdateMembershipPlanMutation();
  const [deletePlan] = useDeleteMembershipPlanMutation();

  // Table columns
  const columns: TableColumnsType<MembershipPlanType> = useMemo(
    () => [
      {
        title: "Type",
        dataIndex: "membershipType",
        render: (v: string) => <Text strong>{v}</Text>,
      },
      {
        title: "Title",
        dataIndex: "title",
        render: (v: string) => (
          <Text style={{ fontSize: 16, fontWeight: 500 }}>{v}</Text>
        ),
      },
      {
        title: "Enable familyMembership",
        dataIndex: ["familyMembershipOptions", "enableFamilyMembers"],
        render: (enable: boolean | undefined) =>
          enable !== undefined
            ? (
              <span style={{ color: enable ? "#4caf50" : "#f44336", fontWeight: 500 }}>
                {enable ? "Yes" : "No"}
              </span>
            ) : (
              <span style={{ color: "#aaa" }}>-</span>
            ),
      },
      {
        title: "Published",
        dataIndex: "isActive",
        align: "center",
        render: (active: boolean, record) => (
          <Switch
            checked={active}
            size="default"
            onChange={async (checked) => {
              await updatePlan({
                id: record.membershipType,
                data: { isActive: checked }
              }).unwrap();
              message.success(`Membership ${checked ? "enabled" : "disabled"}`);
              refetch();
            }}
          />
        ),
      },
      {
        title: "Family Limit",
        dataIndex: "familyMembershipOptions",
        align: "center",
        render: (f: FamilyMembershipOptions | undefined) =>
          f && f.enableFamilyMembers && f.familyMembershipLimit
            ? `Up to ${f.familyMembershipLimit}`
            : <span style={{ color: "#aaa" }}>N/A</span>,
      },
      {
        title: "Actions",
        align: "center",
        fixed: "right",
        width: 170,
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
                title="Delete this membership plan?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deletePlan(record?.membershipType).unwrap();
                  message.success("Membership plan deleted");
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
    [updateLoading, page, limit]
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
        <MemberShipPlanModalInfo
          plan={viewItem as any}
          open={viewOpen}
          onClose={() => setViewOpen(false)}
        />

        <MemberShipPlanModel
          open={formOpen}
          loading={createLoading || updateLoading}
          // Main fix here: use 'editPlan' prop instead of incorrect 'editEvent'
          editPlan={editItem as any}
          onClose={() => {
            setFormOpen(false);
            setEditItem(null);
          }}
          onAdd={async (formData) => {
            try {
              await createPlan(formData).unwrap();
              message.success("Membership plan added");
              setFormOpen(false);
              refetch();
            } catch (err: any) {
              message.error(
                err?.data?.message ||
                  err?.data?.error ||
                  err?.message ||
                  "Failed to add membership plan"
              );
            }
          }}
          onUpdate={async (membershipType, formData) => {
            try {
              await updatePlan({ id: membershipType, data: formData }).unwrap();
              message.success("Membership plan updated");
              setFormOpen(false);
              setEditItem(null);
              refetch();
            } catch (err: any) {
              message.error(
                err?.data?.message ||
                  err?.data?.error ||
                  err?.message ||
                  "Failed to update membership plan"
              );
            }
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
              placeholder="Search membership plans"
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
                setEditItem(null);
                setFormOpen(true);
              }}
            >
              Add Membership Plan
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

export default MemberShipPlan;
