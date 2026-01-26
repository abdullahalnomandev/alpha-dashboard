import React, { useMemo, useState } from "react";
import {
  Typography,
  Input,
  Button,
  Spin,
  message,
  Space,
  Popconfirm,
  Tooltip,
  Alert,
  Table,
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  useGetContactUsQuery,
  useGetContactUsDetailsQuery,
  useCreateContactUsMutation,
  useUpdateContactUsMutation,
  useDeleteContactUsMutation,
} from "../../redux/apiSlices/contactSlice";
import { ContactUsModal } from "./ContactUsModal";
import { imageUrl } from "../../redux/api/baseApi";

const { Text, Title } = Typography;

export type ContactUsType = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

const ContactUs: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [editId, setEditId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useGetContactUsQuery({
    query: {
      page,
      limit,
      ...(search.trim() ? { searchTerm: search } : {}),
    },
  });

  const [createContactUs, { isLoading: createLoading }] = useCreateContactUsMutation();
  const [updateContactUs, { isLoading: updateLoading }] = useUpdateContactUsMutation();
  const [deleteContactUs, { isLoading: deleteLoading }] = useDeleteContactUsMutation();

  const { data: editContactUsDetails, isLoading: editLoading } = useGetContactUsDetailsQuery(
    editId!,
    {
      skip: !formOpen || !editId,
    }
  );

  React.useEffect(() => {
    if (error) {
      setErrorMsg("Failed to load contact information, please try again.");
    } else {
      setErrorMsg(null);
    }
  }, [error]);

  // Format the data (with serial number and all fields needed for table)
  const tableData: (ContactUsType & { sl: number })[] = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return data.data.map((record: ContactUsType, idx: number) => ({
      ...record,
      sl: (page - 1) * limit + idx + 1,
    }));
  }, [data, search, page, limit]);

  // Table columns, matching club/index.tsx style
  const columns: TableColumnsType<ContactUsType & { sl: number }> = [
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
      key: "image",
      render: (src: string) =>
        src ? (
          <img
            src={src.startsWith("http") ? src : `${imageUrl}${src}`}
            alt="contact"
            style={{
              height: 48,
              width: 48,
              objectFit: "cover",
              borderRadius: 8,
              background: "#f5f5f5",
            }}
          />
        ) : (
          <span style={{ color: "#ccc" }}>No image</span>
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
      render: (desc: string) =>
        desc ? (
          <span
            style={{ color: "#4B5770" }}
            dangerouslySetInnerHTML={{ __html: desc }}
          />
        ) : (
          <span style={{ color: "#B6BCCB", fontStyle: "italic" }}>Not set</span>
        ),
    },
    {
      title: "Action",
      align: "center",
      fixed: "right",
      key: "action",
      width: 120,
      render: (_: any, record: ContactUsType & { sl: number }) => (
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
              title="Delete this contact info?"
              okText="Delete"
              okType="danger"
              onConfirm={async () => {
                try {
                  await deleteContactUs(record._id).unwrap();
                  message.success("Deleted");
                  refetch();
                } catch {
                  message.error("Failed to delete contact info");
                }
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
  ];

  // Pagination config for Antd Table
  const pagination: TablePaginationConfig = {
    total: data?.pagination?.total || 0,
    current: page,
    pageSize: limit,
    showSizeChanger: true,
    onChange: (p, s) => {
      setPage(p);
      setLimit(s || 10);
    },
  };

  return (
    <div>
      {/* Modals */}
      <ContactUsModal
        open={formOpen}
        loading={createLoading || updateLoading || editLoading}
        editClub={isAddMode ? null : editContactUsDetails?.data}
        onClose={() => {
          setFormOpen(false);
          setEditId(null);
          setIsAddMode(false);
        }}
        onAdd={async (formData: FormData) => {
          try {
            await createContactUs(formData).unwrap();
            message.success("Contact info added");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
            refetch();
          } catch {
            message.error("Failed to add contact info.");
          }
        }}
        onUpdate={async (id, formData) => {
          try {
            await updateContactUs({ id, data: formData }).unwrap();
            message.success("Contact info updated");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
            refetch();
          } catch {
            message.error("Failed to update contact info.");
          }
        }}
      />

      {/* Top Actions */}
      <div
        style={{
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "100%",
        }}
      >
        <Title
          level={3}
          style={{
            color: "#244065",
            fontWeight: 700,
            margin: 0,
            letterSpacing: 0.5,
            fontSize: 26,
          }}
        >
          Contact Information
        </Title>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Input
            prefix={<FiSearch style={{ fontSize: 16, color: "#8c8c8c" }} />}
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            allowClear
            style={{ width: 250 }}
            size="large"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{
              borderRadius: 8,
              fontWeight: 600,
              minWidth: 120,
              boxShadow: "0 1px 9px #e8f2ff",
              height: 40,
              letterSpacing: 0.5,
            }}
            onClick={() => {
              setEditId(null);
              setFormOpen(true);
              setIsAddMode(true);
            }}
          >
            Add new
          </Button>
        </div>
      </div>

      {errorMsg && (
        <Alert
          type="error"
          showIcon
          closable
          style={{ marginBottom: 24, maxWidth: 720 }}
          onClose={() => setErrorMsg(null)}
          message={errorMsg}
        />
      )}

      <Spin spinning={isLoading || deleteLoading}>
        <Table
          rowKey="_id"
          style={{ overflowX: "auto", marginTop: 10 }}
          dataSource={tableData}
          columns={columns as any}
          className="event-table-custom-gray event-table-gray-row-border"
          pagination={pagination}
          loading={isLoading}
          scroll={window.innerWidth < 600 ? undefined : { y: `calc(100vh - 320px)` }}
        />
      </Spin>
    </div>
  );
};

export default ContactUs;
