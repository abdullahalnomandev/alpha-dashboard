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
  Modal
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import {
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  useGetMembershipApplicationsQuery,
  useCreateMembershipApplicationMutation,
  useUpdateMembershipApplicationMutation,
  useDeleteMembershipApplicationMutation,
} from "../../redux/apiSlices/membershipApplicationSlice";
import { MemberShipApplicationInfoModel } from "./MemberShipApplicationInfoModel";
import { MemberShipApplicationCreate } from "./MemberShipApplicationCreate";

const { Text } = Typography;

/* =====================
   Types
===================== */
export type FamilyMember = {
  name: string;
  email:string;
  relation: string;
};

export type MembershipApplicationType = {
  _id: string;
  membershipType: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  familyMembers: FamilyMember[];
  membershipStatus: string;
  expireId: string;
  createdAt: string;
  updatedAt: string;
  memberShipId: string;
  from?: string; // Add new optional "from" field
};

/* Status ENUM */
const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
};


/* Colorful/Shadow for Status Buttons */
const STATUS_STYLES: Record<string, React.CSSProperties> = {
  [STATUS.ACTIVE]: {
    color: "#52c41a",
    // Custom subtle green translucent shadow
    boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.08)",
    backgroundColor: "rgba(82,196,26,0.1)",
    borderRadius: 6,
    padding: "2px 10px",
    fontWeight: 500,
    display: "inline-block"
  },
  [STATUS.PENDING]: {
    color: "#faad14",
    boxShadow: "0 0 0 2px rgba(250, 173, 20, 0.08)",
    backgroundColor: "rgba(250,173,20,0.1)",
    borderRadius: 6,
    padding: "2px 10px",
    fontWeight: 500,
    display: "inline-block"
  },
  [STATUS.REJECTED]: {
    color: "#f5222d",
    boxShadow: "0 0 0 2px rgba(245, 34, 45, 0.08)",
    backgroundColor: "rgba(245,34,45,0.07)",
    borderRadius: 6,
    padding: "2px 10px",
    fontWeight: 500,
    display: "inline-block"
  }
};

// Only color, fontWeight and fontSize kept as per instruction
const MEMBERSHIP_TYPE_STYLES: Record<string, React.CSSProperties> = {
  alpha: {
    color: "#334155",
    background: "#f8fafc",
    borderRadius: 6,
    fontWeight: 500,
    fontSize: 15,
    padding: "2px 10px",
    display: "inline-block",
  },
  alpha_family: {
    color: "#1c6758",
    background: "#f6fffb",
    borderRadius: 6,
    fontWeight: 500,
    fontSize: 15,
    padding: "2px 10px",
    display: "inline-block",
  },
};

/* =====================
   Main Page
===================== */
const MembershipApplication: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [viewItem, setViewItem] = useState<MembershipApplicationType | null>(
    null
  );
  const [editItem, setEditItem] = useState<MembershipApplicationType | null>(
    null
  );

  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // New state for decision confirmation
  const [decisionModal, setDecisionModal] = useState<{
    open: boolean;
    type: "accept" | "reject" | null;
    record: MembershipApplicationType | null;
    loading: boolean;
  }>({
    open: false,
    type: null,
    record: null,
    loading: false,
  });

  // New state for filter "from"

  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading, refetch } = useGetMembershipApplicationsQuery({ query });
  const [createApplication, { isLoading: createLoading }] = useCreateMembershipApplicationMutation();
  const [updateApplication, { isLoading: updateLoading }] = useUpdateMembershipApplicationMutation();
  const [deleteApplication, { isLoading: deleteLoading }] = useDeleteMembershipApplicationMutation();

  // Handler for accepting/rejecting with confirmation modal
  const handleDecision = (type: "accept" | "reject", record: MembershipApplicationType) => {
    setDecisionModal({
      open: true,
      type,
      record,
      loading: false,
    });
  };

  const handleConfirmDecision = async () => {
    if (!decisionModal.type || !decisionModal.record) return;
    setDecisionModal((prev) => ({ ...prev, loading: true }));

    try {
      // --- CHANGE: send only updated membershipStatus for decision action ---
      if (decisionModal.type === "accept") {
        await updateApplication({
          id: decisionModal.record._id,
          data: { membershipStatus: STATUS.ACTIVE },
        }).unwrap();
        message.success(`Membership set to Active`);
      } else {
        await updateApplication({
          id: decisionModal.record._id,
          data: { membershipStatus: STATUS.REJECTED },
        }).unwrap();
        message.success(`Membership Rejected`);
      }
      refetch();
    } catch (e) {
      message.error("Failed to update status");
    }
    setDecisionModal({ open: false, type: null, record: null, loading: false });
  };

  const handleCancelDecision = () => {
    setDecisionModal({ open: false, type: null, record: null, loading: false });
  };

  const columns: TableColumnsType<MembershipApplicationType> = useMemo(
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
        title: "Membership ID",
        dataIndex: "memberShipId",
        key: "memberShipId",
        render: (id: string) => (
          <Text strong style={{ fontSize: 16 }}>
            {id}
          </Text>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (v: string) => (
          <Text style={{ fontSize: 16 }}>{v}</Text>
        ),
      },
      {
        title: "Membership Type",
        dataIndex: "membershipType",
        key: "membershipType",
        render: (v: string) => {
          const style =
            MEMBERSHIP_TYPE_STYLES[v] ||
            { fontSize: 15 }; // fallback style for other types
          return (
            <span style={style}>
              {v.replace(/_/g, " ")}
            </span>
          );
        },
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Expires",
        dataIndex: "expireId",
        key: "expireId",
        render: (v: string) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
      },
      {
        title: "Status",
        dataIndex: "membershipStatus",
        key: "membershipStatus",
        render: (status: string) => (
          <span
            style={STATUS_STYLES[status] || {}}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        ),
      },
    
      {
        title: "Decision",
        dataIndex: "decision",
        key: "decision",
        align: "center",
        render: (_: any, record: MembershipApplicationType) =>
          record.membershipStatus === STATUS.PENDING ? (
            <Space>
              <Tooltip title="Accept membership application">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleDecision("accept", record)}
                  // loading={updateLoading}
                  style={{
                    background: "#52c41a",
                    borderColor: "#52c41a",
                    boxShadow: "0 2px 10px rgba(82,196,26,0.10)"
                  }}
                >
                  Accept
                </Button>
              </Tooltip>
              <Tooltip title="Reject membership application">
                <Button
                  type="primary"
                  size="small"
                  danger
                  onClick={() => handleDecision("reject", record)}
                  // loading={updateLoading}
                  style={{ boxShadow: "0 2px 10px rgba(245,34,45,0.10)" }}
                >
                  Reject
                </Button>
              </Tooltip>
            </Space>
          ) : (
            <span style={{ color: "#8c8c8c" }}>-</span>
          ),
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record: MembershipApplicationType) => (
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
                title="Delete this application?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteApplication(record._id).unwrap();
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
    <div>
      {/* Modals */}
      <MemberShipApplicationInfoModel
        open={viewOpen}
        application={viewItem}
        onClose={() => setViewOpen(false)}
      />

      <MemberShipApplicationCreate
        open={formOpen}
        loading={createLoading || updateLoading}
        editApplication={editItem}
        onClose={() => {
          setFormOpen(false);
          setEditItem(null);
        }}
        onAdd={async (values) => {
          await createApplication(values).unwrap();
          message.success("Membership application added");
          setFormOpen(false);
          refetch();
        }}
        onUpdate={async (id, values) => {
          // Don't send email on update (remove email from values)
          const { email, ...noEmail } = values;
          await updateApplication({ id, data: noEmail }).unwrap();
          message.success("Membership application updated");
          setFormOpen(false);
          setEditItem(null);
          refetch();
        }}
      />

      {/* Decision Confirmation Modal */}
      <Modal
        open={decisionModal.open}
        onCancel={handleCancelDecision}
        onOk={handleConfirmDecision}
        okButtonProps={{ loading: decisionModal.loading }}
        cancelButtonProps={{ disabled: decisionModal.loading }}
        okText={
          decisionModal.type === "accept"
            ? "Accept"
            : decisionModal.type === "reject"
            ? "Reject"
            : "Confirm"
        }
        cancelText="Cancel"
        title={
          decisionModal.type === "accept"
            ? "Confirm Accept"
            : decisionModal.type === "reject"
            ? "Confirm Reject"
            : "Confirm"
        }
        destroyOnClose
      >
        <div>
          {decisionModal.type === "accept"
            ? "Are you sure you want to accept this membership application? This will activate the membership."
            : decisionModal.type === "reject"
            ? "Are you sure you want to reject this membership application? This will change the status to Rejected."
            : ""}
        </div>
      </Modal>

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
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Input
              prefix={<FiSearch style={{ fontSize: 16, color: "#8c8c8c" }} />}
              type="text"
              placeholder="Search membership applications"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ width: 250 }}
              size="large"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <Spin spinning={isLoading}>
        <Table
          rowKey="_id"
          style={{ overflowX: "auto", marginTop: 20 }}
          dataSource={data?.data || []}
          columns={columns}
          className="membership-application-table"
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
  );
};

export default MembershipApplication;
