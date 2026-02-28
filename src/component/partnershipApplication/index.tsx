import React, { useMemo, useState } from "react";
import {
  Table,
  Typography,
  Input,
  Button,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Modal,
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiSearch } from "react-icons/fi";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { PartnerShipApplicationInfoModel } from "./PartnerShipApplicationInfoModel";
import { FaRegFileExcel } from "react-icons/fa6";
import { useDeletepartnerShipApplicationMutation, useGetpartnerShipApplicationsQuery, useUpdatepartnerShipApplicationMutation } from "../../redux/apiSlices/partnershipApplicationSlice";
import { handleExportPartnershipToCsv } from "./utils/handleExportToCsv";
const { Text } = Typography;

/* =====================
   Types
===================== */
export type FamilyMember = {
  name: string;
  email: string;
  relation: string;
};

export type PartnerShipApplicationType = {
  _id: string;
  profileImage: string;
  companyName: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  message: string;
  partnerShipStatus: 'pending' | 'active' | 'rejected'; // future-proof
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  partnerShipId: string;
};

/* Status ENUM */
const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
};

/* Colorful/Shadow for Status Buttons */
export const STATUS_STYLES: Record<string, React.CSSProperties> = {
  [STATUS.ACTIVE]: {
    color: "#52c41a",
    // Custom subtle green translucent shadow
    boxShadow: "0 0 0 2px rgba(82, 196, 26, 0.08)",
    backgroundColor: "rgba(82,196,26,0.1)",
    borderRadius: 6,
    padding: "2px 10px",
    fontWeight: 500,
    maxWidth: 60,
    display: "inline-block",
  },
  [STATUS.PENDING]: {
    color: "#faad14",
    boxShadow: "0 0 0 2px rgba(250, 173, 20, 0.08)",
    backgroundColor: "rgba(250,173,20,0.1)",
    borderRadius: 6,
    padding: "2px 10px",
    fontWeight: 500,
    display: "inline-block",
  },
  [STATUS.REJECTED]: {
    color: "#f5222d",
    boxShadow: "0 0 0 2px rgba(245, 34, 45, 0.08)",
    backgroundColor: "rgba(245,34,45,0.07)",
    borderRadius: 6,
    padding: "2px 10px",
    fontWeight: 500,
    display: "inline-block",
  },
};

// Only color, fontWeight and fontSize kept as per instruction
// const PartnerShip_TYPE_STYLES: Record<string, React.CSSProperties> = {
//   alpha: {
//     color: "#334155",
//     background: "#f8fafc",
//     borderRadius: 6,
//     fontWeight: 500,
//     fontSize: 15,
//     padding: "2px 10px",
//     display: "inline-block",
//   },
//   alpha_family: {
//     color: "#1c6758",
//     background: "#f6fffb",
//     borderRadius: 6,
//     fontWeight: 500,
//     fontSize: 15,
//     padding: "2px 10px",
//     display: "inline-block",
//   },
// };

/* =====================
   Main Page
===================== */
const PartnerShipApplication: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewOpen, setViewOpen] = useState(false);

  const [viewItem, setViewItem] = useState<PartnerShipApplicationType | null>(
    null,
  );
  // const [editItem, setEditItem] = useState<PartnerShipApplicationType | null>(
  //   null,
  // );

  // const [formOpen, setFormOpen] = useState(false);

  // New state for decision confirmation
  const [decisionModal, setDecisionModal] = useState<{
    open: boolean;
    type: "active" | "reject" | null;
    record: PartnerShipApplicationType | null;
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

  const { data, isLoading, refetch } = useGetpartnerShipApplicationsQuery({
    query,
  });
  // const [createApplication, { isLoading: createLoading }] =
  //   useCreatepartnerShipApplicationMutation();
  const [updateApplication, { isLoading: updateLoading }] =
    useUpdatepartnerShipApplicationMutation();
  const [deleteApplication, { isLoading: deleteLoading }] =
    useDeletepartnerShipApplicationMutation();

  // Handler for accepting/rejecting with confirmation modal
  const handleDecision = (
    type: "active" | "reject",
    record: PartnerShipApplicationType,
  ) => {
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
      // --- CHANGE: send only updated PartnerShipStatus for decision action ---
      if (decisionModal.type === "active") {
        await updateApplication({
          id: decisionModal.record._id,
          data: { partnerShipStatus: STATUS.ACTIVE },
        }).unwrap();
        message.success(`PartnerShip set to Active`);
      } else {
        await updateApplication({
          id: decisionModal.record._id,
          data: { partnerShipStatus: STATUS.REJECTED },
        }).unwrap();
        message.success(`PartnerShip Rejected`);
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

  const columns: TableColumnsType<PartnerShipApplicationType> = useMemo(
    () => [
      {
        title: "Sl#",
        dataIndex: "sl",
        key: "sl",
        align: "center",
        width: 80,
        render: (_: any, __: any, index: number) => {
          const serial = (page - 1) * limit + index + 1;
          return <span>{serial < 10 ? `0${serial}` : serial}</span>;
        },
      },
      {
        title: "PartnerShip ID",
        dataIndex: "partnerShipId",
        key: "partnerShipId",
        render: (id: string) => (
          <Text strong style={{ fontSize: 16 }}>
            {id}
          </Text>
        ),
      },
      {
        title: "Company Name",
        dataIndex: "companyName",
        key: "companyName",
        render: (name: string) => <Tooltip title={name}>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", maxWidth: 260 }}>
            {name}
          </span>
        </Tooltip>,
      },
      {
        title: "Name",
        dataIndex: "contactName",
        key: "contactName",
        render: (v: string) => <span>{v}</span>,
      },
      {
        title: "Phone",
        dataIndex: "contactPhone",
        key: "contactPhone",
        render: (v: string) => <span>{v}</span>,
      },
      {
        title: "Status",
        dataIndex: "partnerShipStatus",
        key: "partnerShipStatus",
        render: (status: string) => (
          <span style={STATUS_STYLES[status] || {}}>
            {status && status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        ),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (v: string) => (v ? dayjs(v).format("DD MMM YYYY") : "-"),
      },
      {
        title: "Decision",
        dataIndex: "decision",
        key: "decision",
        align: "center",
        render: (_: any, record: PartnerShipApplicationType) =>
          record.partnerShipStatus === STATUS.PENDING ? (
            <Space>
              <Tooltip title="Accept PartnerShip application">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleDecision("active", record)}
                  style={{
                    background: "#52c41a",
                    borderColor: "#52c41a",
                    boxShadow: "0 2px 10px rgba(82,196,26,0.10)",
                  }}
                >
                  Accept
                </Button>
              </Tooltip>
              <Tooltip title="Reject PartnerShip application">
                <Button
                  type="primary"
                  size="small"
                  danger
                  onClick={() => handleDecision("reject", record)}
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
        render: (_: any, record: PartnerShipApplicationType) => (
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
            {/* <Tooltip title="Edit">
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
            </Tooltip> */}
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
    [updateLoading, deleteLoading, page, limit],
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

  // Find proper familyPartnerShipOptions to pass to the info model
  // We'll use the currently viewed application (viewItem), falling back to undefined
  return (
    <div>
      {/* Modals */}
      <PartnerShipApplicationInfoModel
        open={viewOpen}
        application={viewItem}
        onClose={() => setViewOpen(false)}
      />

      {/* <PartnerShipApplicationCreate
        open={formOpen}
        loading={createLoading || updateLoading}
        editApplication={editItem}
        onClose={() => {
          setFormOpen(false);
          setEditItem(null);
        }}
        onAdd={async (values) => {
          await createApplication(values).unwrap();
          message.success("PartnerShip application added");
          setFormOpen(false);
          refetch();
        }}
        onUpdate={async (id, values) => {
          const { email, ...noEmail } = values;
          await updateApplication({ id, data: noEmail }).unwrap();
          message.success("PartnerShip application updated");
          setFormOpen(false);
          setEditItem(null);
          refetch();
        }}
      /> */}

      {/* Decision Confirmation Modal */}
      <Modal
        open={decisionModal.open}
        onCancel={handleCancelDecision}
        onOk={handleConfirmDecision}
        okButtonProps={{ loading: decisionModal.loading }}
        cancelButtonProps={{ disabled: decisionModal.loading }}
        okText={
          decisionModal.type === "active"
            ? "Accept"
            : decisionModal.type === "reject"
              ? "Reject"
              : "Confirm"
        }
        cancelText="Cancel"
        title={
          decisionModal.type === "active"
            ? "Confirm Accept"
            : decisionModal.type === "reject"
              ? "Confirm Reject"
              : "Confirm"
        }
        destroyOnClose
      >
        <div>
          {decisionModal.type === "active"
            ? "Are you sure you want to accept this PartnerShip application? This will activate the PartnerShip."
            : decisionModal.type === "reject"
              ? "Are you sure you want to reject this PartnerShip application? This will change the status to Rejected."
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
              placeholder="Search PartnerShip applications"
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
          <div>
            <Button
              type="primary"
              size="large"
              icon={<FaRegFileExcel style={{ fontSize: 18, marginRight: 6 }} />}
              onClick={() => handleExportPartnershipToCsv()}
            >
              Export as CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        style={{ overflowX: "auto", marginTop: 20 }}
        dataSource={data?.data || []}
        columns={columns}
        className="PartnerShip-application-table"
        pagination={pagination}
        loading={isLoading}
        scroll={
          window.innerWidth < 600 ? undefined : { y: `calc(100vh - 320px)` }
        }
      />
    </div>
  );
};

export default PartnerShipApplication;
