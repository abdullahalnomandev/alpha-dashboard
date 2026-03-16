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
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";

import { ContactInfoModel } from "./ContactInfoModel";
import { ContactFormModal } from "./ContactFormModal";

import {
  useDeleteTeamContactFormMutation,
  useGetTeamContactFormDetailsQuery,
  useGetTeamContactFormsQuery,
  useSubmitTeamContactFormMutation,
  useUpdateTeamContactFormMutation,
} from "../../redux/apiSlices/contactInfoSlice";

const { Text } = Typography;

export type IContactUs = {
  _id?: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  location?: string;
  createdAt?: string;
};

const ContactInfo: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  /* View Modal */
  const [viewId, setViewId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  /* Form Modal */
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editForm, setEditForm] = useState<IContactUs | null>(null);

  /* RTK Query Hooks */
  const { data, isLoading, refetch } = useGetTeamContactFormsQuery({
    query: { page, limit, searchTerm: search || undefined },
  });

  const { data: contactDetails } = useGetTeamContactFormDetailsQuery(viewId!, {
    skip: !viewOpen || !viewId,
  });

  const [submitContactForm] = useSubmitTeamContactFormMutation();
  const [updateContactForm] = useUpdateTeamContactFormMutation();
  const [deleteContactForm] = useDeleteTeamContactFormMutation();

  /* Submit Form */
  const handleSubmit = async (values: IContactUs) => {
    try {
      setFormLoading(true);
      if (editForm?._id) {
        // Update
        await updateContactForm({ id: editForm._id, data: values }).unwrap();
        message.success("Contact updated successfully");
      } else {
        // Add
        await submitContactForm(values).unwrap();
        message.success("Contact added successfully");
      }
      setFormOpen(false);
      setEditForm(null);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  /* Table Columns */
  const columns: TableColumnsType<IContactUs> = useMemo(
    () => [
      {
        title: "Sl#",
        key: "sl",
        align: "center",
        width: 70,
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
      { title: "Role", dataIndex: "title" },
      { title: "Phone", dataIndex: "phone" },
      {
        title: "Email",
        dataIndex: "email",
        render: (email: string) => <span style={{ color: "#2A62A6" }}>{email}</span>,
      },
      { title: "Location", dataIndex: "location" },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (createdAt: string) => {
          const d = new Date(createdAt);
          return `${d.getDate()} ${d.toLocaleString("default", {
            month: "short",
          })} ${d.getFullYear()}, ${d.getHours().toString().padStart(2, "0")}:${d
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        },
      },
      {
        title: "Action",
        align: "center",
        render: (_: any, record: IContactUs) => (
          <Space>
            <Tooltip title="View">
              <Button
                type="link"
                icon={<EyeOutlined />}
                style={{ color: "#2A62A6" }}
                onClick={() => {
                  setViewId(record._id!);
                  setViewOpen(true);
                }}
              />
            </Tooltip>

            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<FiEdit />}
                style={{ color: "#2A62A6" }}
                onClick={() => {
                  setEditForm(record);
                  setFormOpen(true);
                }}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this contact?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteContactForm(record._id!).unwrap();
                  message.success("Deleted");
                  refetch();
                }}
              >
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [page, limit]
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

  const formatContactFormData = (rawData: any[] = []) =>
    rawData.map((form) => ({
      _id: form._id,
      name: form.name,
      title: form.title,
      phone: form.phone,
      email: form.email,
      location: form.location,
      createdAt: form.createdAt,
    }));

  return (
    <div>
      {/* View Modal */}
      <ContactInfoModel
        open={viewOpen}
        club={
          viewOpen && contactDetails?.data
            ? {
                _id: contactDetails.data._id,
                name: contactDetails.data.name,
                title: contactDetails.data.title,
                phone: contactDetails.data.phone,
                email: contactDetails.data.email,
                location: contactDetails.data.location,
              }
            : null
        }
        onClose={() => {
          setViewOpen(false);
          setViewId(null);
        }}
      />

      {/* Add / Edit Modal */}
      <ContactFormModal
        open={formOpen}
        loading={formLoading}
        data={editForm}
        onClose={() => {
          setFormOpen(false);
          setEditForm(null);
        }}
        onSubmit={handleSubmit as any}
      />

      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Input
          prefix={<FiSearch style={{ color: "#8c8c8c" }} />}
          placeholder="Search contacts"
          value={search}
          allowClear
          size="large"
          style={{ width: 350 }}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setEditForm(null);
            setFormOpen(true);
          }}
        >
          Add Contact
        </Button>
      </div>

      {/* Table */}
      <Spin spinning={isLoading}>
        <Table
          rowKey="_id"
          dataSource={formatContactFormData(data?.data)}
          columns={columns as any}
          pagination={pagination}
          loading={isLoading}
        />
      </Spin>
    </div>
  );
};

export default ContactInfo;