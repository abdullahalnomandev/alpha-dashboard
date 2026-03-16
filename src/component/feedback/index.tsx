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
import { FiSearch } from "react-icons/fi";
import { EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetFeedbacksQuery,
  useDeleteFeedbackMutation,
} from "../../redux/apiSlices/feedbackSlice";
import type { FeedbackInfoType } from "./FeedbackInfo";
// import { FeedbackModel } from "./feedbackModel";
// import { FeedbackInfoModel } from "./FeedbackInfo";


const { Text } = Typography;

/* =====================
   Types
===================== */
// export type FeedbackType = FeedbackInfoType;

/* =====================
   Main Page
===================== */
const Feedback: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal states
  // const [viewId, setViewId] = useState<string | null>(null);
  // const [editId, setEditId] = useState<string | null>(null);
  // const [viewOpen, setViewOpen] = useState(false);
  // const [formOpen, setFormOpen] = useState(false);
  // const [isAddMode, setIsAddMode] = useState(false);

  // Query params
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // API hooks
  const { data, isLoading, refetch } = useGetFeedbacksQuery({ query });
  // const [createFeedback, { isLoading: createLoading }] = useCreateFeedbackMutation();
  // const [updateFeedback, { isLoading: updateLoading }] = useUpdateFeedbackMutation();
  const [deleteFeedback, { isLoading: deleteLoading }] = useDeleteFeedbackMutation();

  // Get feedback details for view modal
  // const { data: feedbackDetails } = useGetFeedbackDetailsQuery(viewId!, {
  //   skip: !viewOpen || !viewId,
  // });

  // Get feedback details for edit modal
  // const { data: editFeedbackDetails } = useGetFeedbackDetailsQuery(editId!, {
  //   skip: !formOpen || !editId,
  // });

  // Table columns
  const columns: TableColumnsType<FeedbackInfoType> = useMemo(
    () => [
      {
        title: "Sl",
        dataIndex: "sl",
        key: "sl",
        align: "center",
        render: (_: any, __: any, index: number) => {
          const serial = (page - 1) * limit + index + 1;
          return <span>#{serial < 10 ? `0${serial}` : serial}</span>;
        },
      },
      {
        title: "Partner",
        dataIndex: ["partner", "name"],
        render: (_: any, record: FeedbackInfoType) => <Text>{record.partner?.name || record.partner?._id}</Text>,
      },
      {
        title: "Email",
        dataIndex: ["partner", "email"],
        render: (_: any, record: FeedbackInfoType) => <Text>{record.partner?.email || "-"}</Text>,
      },
      {
        title: "Rating",
        dataIndex: "rating",
        render: (v: number) => <Text>{v} / 5</Text>,
      },
      {
        title: "Comment",
        dataIndex: "comment",
        render: (v: string) => <Text>{v}</Text>,
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record : FeedbackInfoType) => (
          <Space>
            {/* <Tooltip title="View">
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
            </Tooltip> */}

            {/* <Tooltip title="Edit">
              <Button
                type="link"
                style={{ color: "#2A62A6" }}
                onClick={() => {
                  setEditId(record._id);
                  setIsAddMode(false);
                  setFormOpen(true);
                }}
              >
                Edit
              </Button>
            </Tooltip> */}

            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this feedback?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteFeedback(record._id).unwrap();
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
    [deleteLoading, page, limit]
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

  const formatFeedbackData = (rawData: any[] = []) =>
    rawData.map((f) => ({
      _id: f._id,
      partner: f.partner,
      rating: f.rating,
      comment: f.comment,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));

  return (
    <div>
      {/* Modals */}
      {/* <FeedbackInfoModel
        open={viewOpen}
        feedback={viewOpen && feedbackDetails?.data ? feedbackDetails.data : null}
        onClose={() => {
          setViewOpen(false);
          setViewId(null);
        }}
      />

      <FeedbackModel
        open={formOpen}
        loading={createLoading || updateLoading}
        editFeedback={isAddMode ? null : formOpen && editFeedbackDetails?.data ? editFeedbackDetails.data : null}
        onClose={() => {
          setFormOpen(false);
          setEditId(null);
          setIsAddMode(false);
        }}
        onAdd={async (formData) => {
          await createFeedback(formData as any).unwrap();
          message.success("Feedback added");
          setFormOpen(false);
          setEditId(null);
          setIsAddMode(false);
          refetch();
        }}
        onUpdate={async (id, formData) => {
          await updateFeedback({ id, ...formData } as any).unwrap();
          message.success("Feedback updated");
          setFormOpen(false);
          setEditId(null);
          setIsAddMode(false);
          refetch();
        }} */}
      {/* /> */}

      {/* Top Actions */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Input
          prefix={<FiSearch style={{ fontSize: 16, color: "#8c8c8c" }} />}
          type="text"
          placeholder="Search feedback"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          allowClear
          style={{ width: 350 }}
          size="large"
        />
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ height: 40, fontWeight: 500, letterSpacing: 0.5 }}
          size="large"
          onClick={() => {
            setFormOpen(true);
            setEditId(null);
            setIsAddMode(true);
          }}
        >
          Add Feedback
        </Button> */}
      </div>

      {/* Table */}
      {/* <Spin spinning={isLoading || createLoading || updateLoading}>           */}
        <Table
          rowKey="_id"
          style={{ overflowX: "auto" }}
          dataSource={formatFeedbackData(data?.data)}
          columns={columns as any}
          pagination={pagination}
          loading={isLoading}
          scroll={window.innerWidth < 600 ? undefined : { y: `calc(100vh - 250px)` }}
        />
    </div>
  );
};

export default Feedback;