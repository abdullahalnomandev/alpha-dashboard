import React, { useState, useMemo } from "react";
import {
  Typography,
  Input,
  Button,
  Spin,
  message,
  Popconfirm,
  Tooltip,
  Collapse,
  Space,
} from "antd";
import { FiEdit, FiSearch, FiChevronRight } from "react-icons/fi";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { EditorProvider } from "react-simple-wysiwyg";
import {
  useGetFaqsQuery,
  useGetFaqDetailsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "../../redux/apiSlices/faqSlice";
import { FaqModel } from "./FaqModal";

const { Panel } = Collapse;
const { Text, Title } = Typography;

export type FaqType = {
  _id: string;
  title: string;
  description: string;
};

const Faq: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);

  const [editId, setEditId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  const { data, isLoading, refetch } = useGetFaqsQuery({ query });
  const [createFaq, { isLoading: createLoading }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: updateLoading }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: deleteLoading }] = useDeleteFaqMutation();

  const { data: editFaqDetails, isLoading: editLoading } =
    useGetFaqDetailsQuery(editId!, {
      skip: !formOpen || !editId,
    });

  const faqs = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return data.data;
  }, [data]);

  const customExpandIcon = ({ isActive }: { isActive: boolean }) => (
    <FiChevronRight
      size={18}
      style={{
        transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.25s ease",
        color: "#667085",
      }}
    />
  );

  return (
    <EditorProvider>
      <div
        style={{
          padding: "32px 40px",
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        {/* PAGE HEADER */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 24,
            border: "1px solid #e4e7ec",
            boxShadow: "0 4px 12px rgba(16,24,40,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Frequently Asked Questions
              </Title>
              <Text type="secondary">
                Manage questions and answers shown to users
              </Text>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <Input
                prefix={<FiSearch />}
                placeholder="Search FAQ"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                allowClear
                size="large"
                style={{ width: 320, borderRadius: 10 }}
              />

              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                style={{ borderRadius: 10, fontWeight: 600 }}
                onClick={() => {
                  setFormOpen(true);
                  setEditId(null);
                  setIsAddMode(true);
                }}
              >
                Add FAQ
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ LIST */}
        <Spin spinning={isLoading || deleteLoading}>
          <Collapse
            expandIcon={(panelProps) => customExpandIcon({ isActive: !!panelProps.isActive })}
            expandIconPosition="start"
            style={{
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid #e4e7ec",
              padding: 8,
            }}
          >
            {faqs.length === 0 && !isLoading ? (
              <div
                style={{
                  padding: 48,
                  textAlign: "center",
                  color: "#98a2b3",
                }}
              >
                No FAQ found
              </div>
            ) : (
              faqs.map((faq: FaqType) => (
                <Panel
                  key={faq._id}
                  header={
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#101828",
                      }}
                    >
                      {faq.title}
                    </Text>
                  }
                  extra={
                    <Space>
                      <Tooltip title="Edit">
                        <Button
                          type="text"
                          icon={<FiEdit size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditId(faq._id);
                            setIsAddMode(false);
                            setFormOpen(true);
                          }}
                        />
                      </Tooltip>

                      <Popconfirm
                        title="Delete this FAQ?"
                        okText="Delete"
                        okType="danger"
                        onConfirm={async () => {
                          await deleteFaq(faq._id).unwrap();
                          message.success("FAQ deleted");
                          refetch();
                        }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </Space>
                  }
                  style={{
                    marginBottom: 8,
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 18px",
                      background: "#ffffff",
                      borderRadius: 10,
                      fontSize: 15,
                      lineHeight: 1.8,
                      color: "#475467",
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        faq.description ||
                        "<em style='color:#98a2b3;'>No answer provided.</em>",
                    }}
                  />
                </Panel>
              ))
            )}
          </Collapse>
        </Spin>

        {/* MODAL */}
        <FaqModel
          open={formOpen}
          loading={createLoading || updateLoading || editLoading}
          editClub={isAddMode ? null : editFaqDetails?.data}
          onClose={() => {
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
          }}
          onAdd={async ({ title, description }) => {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            await createFaq(formData).unwrap();
            message.success("FAQ added");
            setFormOpen(false);
            refetch();
          }}
          onUpdate={async (id, formData) => {
            await updateFaq({ id, data: formData }).unwrap();
            message.success("FAQ updated");
            setFormOpen(false);
            refetch();
          }}
        />
      </div>
    </EditorProvider>
  );
};

export default Faq;
