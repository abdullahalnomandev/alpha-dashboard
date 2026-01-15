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
import {
  DeleteOutlined,
} from "@ant-design/icons";

import {
  useGetContactFormsQuery,
  useGetContactFormDetailsQuery,
  useDeleteContactFormMutation,
} from "../../redux/apiSlices/contactFormSlice";
import { EditorProvider } from "react-simple-wysiwyg";
import { ContactInfoModel } from "./ContactInfoModel";

const { Text } = Typography;

/* =====================
   Types
===================== */
export type ContactFormType = {
  _id: string;
  name: string;
  contact: string;
  email: string;
  message: string;
  createdAt: string;
};

/* =====================
   Main Page
===================== */
const ContactFormAdminPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // For modal data
  const [viewId, setViewId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // API hooks from contactFormSlice.ts
  const { data, isLoading, refetch } = useGetContactFormsQuery({ query });
  const [deleteContactForm, { isLoading: deleteLoading }] = useDeleteContactFormMutation();

  // Get details for view modal
  const { data: contactDetails } = useGetContactFormDetailsQuery(viewId!, {
    skip: !viewOpen || !viewId,
  });

  const columns: TableColumnsType<ContactFormType> = useMemo(
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
        title: "Name",
        dataIndex: "name",
        render: (v: string) => (
          <Text strong style={{ fontSize: 16 }}>
            {v}
          </Text>
        ),
      },
      {
        title: "Contact",
        dataIndex: "contact",
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (email: string) => (
          <span style={{ color: "#2A62A6" }}>{email}</span>
        ),
      },
      {
        title: "Message",
        dataIndex: "message",
        ellipsis: true,
        width: 300,
        render: (msg: string) => (
          <Tooltip title={msg}>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", maxWidth: 260 }}>
              {msg}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (createdAt: string) => {
          const d = new Date(createdAt);
          const day = d.getDate();
          const month = d.toLocaleString("default", { month: "short" });
          const year = d.getFullYear();
          const hours = d.getHours().toString().padStart(2, "0");
          const minutes = d.getMinutes().toString().padStart(2, "0");
          return (
            <span>
              {`${day} ${month} ${year}, ${hours}:${minutes}`}
            </span>
          );
        },
      },
      {
        title: "Action",
        align: "center",
        fixed: "right",
        render: (_: any, record: ContactFormType) => (
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
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this contact submission?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteContactForm(record._id).unwrap();
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

  // Filter to only display objects with necessary fields
  const formatContactFormData = (rawData: any[] = []) => {
    return rawData.map((form) => ({
      _id: form._id,
      name: form.name,
      contact: form.contact,
      email: form.email,
      message: form.message,
      createdAt: form.createdAt,
    }));
  };

  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <ContactInfoModel
          open={viewOpen}
          club={
            viewOpen && contactDetails && contactDetails.data
              ? {
                  _id: contactDetails.data._id,
                  name: contactDetails.data.name,
                  limitOfMember: 0,
                  numberOfMembers: 0,
                  location: "-",
                  description: (
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <b>Contact:</b> {contactDetails.data.contact}
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <b>Email:</b> {contactDetails.data.email}
                      </div>
                      <div>
                        <b>Message:</b>
                        <div style={{ marginTop: 6 }}>{contactDetails.data.message}</div>
                      </div>
                    </div>
                  ) as any,
                }
              : null
          }
          onClose={() => {
            setViewOpen(false);
            setViewId(null);
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
              placeholder="Search contacts"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              allowClear
              style={{ width: 350 }}
              size="large"
            />
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading}>
          <Table
            rowKey="_id"
            style={{ overflowX: "auto", marginTop: 20 }}
            dataSource={formatContactFormData(data?.data)}
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

export default ContactFormAdminPage;
