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
  Switch, // Add Switch for toggle
} from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import { FiEdit, FiSearch } from "react-icons/fi";
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useGetStoriesQuery,
  useGetStoryDetailsQuery,
  useCreateStoryMutation,
  useUpdateStoryMutation,
  useDeleteStoryMutation,
} from "../../redux/apiSlices/storiesSlice";
import { EditorProvider } from "react-simple-wysiwyg";
import { StoryInfoModal } from "./StoryInfoModal";
import { StoryModal } from "./StoryModal";
import { imageUrl } from "../../redux/api/baseApi";
const { Text } = Typography;

// Types
export type StoryType = {
  _id: string;
  title: string;
  image?: string;
  club?: {
    _id: string;
    name: string;
  };
  likeCount?: number;
  createdAt?: string;
  description?: string;
  updatedAt?: string;
  published?: boolean; // Add published property
};

// Main Page
const Stories: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // For modal data
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Query params for pagination and search
  const query: Record<string, any> = { page, limit };
  if (search.trim()) query.searchTerm = search;

  // API hooks from storiesSlice.ts
  const { data, isLoading, refetch } = useGetStoriesQuery({ query });
  const [createStory, { isLoading: createLoading }] = useCreateStoryMutation();
  const [updateStory, { isLoading: updateLoading }] = useUpdateStoryMutation();
  const [deleteStory, { isLoading: deleteLoading }] = useDeleteStoryMutation();

  // Get details for view modal
  const { data: storyDetails } = useGetStoryDetailsQuery(viewId ?? "", {
    skip: !viewOpen || !viewId,
  });

  // Get details for edit modal
  const {
    data: editStoryDetails,
    isLoading: editLoading,
  } = useGetStoryDetailsQuery(editId ?? "", {
    skip: !formOpen || !editId,
  });

  // Columns for Table
  const columns: TableColumnsType<StoryType> = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "image",
        width: 150,
        render: (_: any, record: StoryType) => {
          const src = record.image;
          return src ? (
            <img
              src={`${imageUrl}${src}`}
              alt="story"
              style={{
                height: 48,
                width: 48,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          ) : (
            <span style={{ color: "#ccc" }}>No image</span>
          );
        },
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
        title: "Club Name",
        dataIndex: ["club", "name"],
        render: (_: any, record: StoryType) =>
          record.club?.name || <span style={{ color: "#aaa" }}>-</span>,
      },
      {
        title: "Likes",
        dataIndex: "likeCount",
        render: (v: number) => v ?? 0,
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        render: (v: string) =>
          v ? new Date(v).toLocaleString() : "-",
      },
      // Add Published toggle column
      {
        title: "Published",
        dataIndex: "published",
        align: "center",
        render: (published: boolean, record: StoryType) => (
          <Switch
            checked={!!published}
            onChange={async (checked) => {
              await updateStory({ id: record._id, data: { published: checked } }).unwrap();
              message.success(`Story ${checked ? "published" : "unpublished"}`);
              refetch();
            }}
          />
        ),
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
                }}
              >
                <FiEdit />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Delete this story?"
                okText="Delete"
                okType="danger"
                onConfirm={async () => {
                  await deleteStory(record._id).unwrap();
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

  // Transform raw stories data to StoryType[]
  const formatStoryData = (rawData: any[] = []) => {
    return rawData.map((story) => ({
      _id: story._id,
      title: story.title,
      image: story.image,
      club: story.club,
      likeCount: story.likeCount,
      createdAt: story.createdAt,
      description: story.description,
      updatedAt: story.updatedAt,
      published: typeof story.published === "boolean" ? story.published : false, // Include published property
    }));
  };

  // Map API detail to modal prop
  const getStoryInfoForModal = () => {
    if (storyDetails && storyDetails.data) {
      const d = storyDetails.data;
      // This returns all details required for StoryInfoModal
      return {
        _id: d._id,
        title: d.title,
        description: d.description,
        image: d.image,
        club: d.club,
        likeCount: d.likeCount,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        published: d.published,
      };
    }
    return null;
  };

  // Map API detail to edit modal
  const getEditStoryInfoForModal = () => {
    if (formOpen && editStoryDetails && editStoryDetails.data && !isAddMode) {
      const d = editStoryDetails.data;
      return {
        _id: d._id,
        name: d.title,
        club: d.club,
        image: d.image,
        description: d.description,
        published: d.published,
      };
    }
    return null;
  };



  return (
    <EditorProvider>
      <div>
        {/* Modals */}
        <StoryInfoModal
          open={viewOpen}
          story={getStoryInfoForModal()}
          onClose={() => {
            setViewOpen(false);
            setViewId(null);
          }}
        />

        <StoryModal
          open={formOpen}
          loading={createLoading || updateLoading || editLoading}
          editClub={isAddMode ? null : getEditStoryInfoForModal()}
          onClose={() => {
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
          }}
          onAdd={async (formData: any) => {
            await createStory(formData).unwrap();
            message.success("Story added");
            setFormOpen(false);
            setEditId(null);
            setIsAddMode(false);
            refetch();
          }}
          onUpdate={async (id: string, formData: any) => {
            await updateStory({ id, data: formData }).unwrap();
            message.success("Story updated");
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
              placeholder="Search stories"
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
              Add Story
            </Button>
          </div>
        </div>

        {/* Table */}
        <Spin spinning={isLoading}>
          <Table
            rowKey="_id"
            style={{ overflowX: "auto", marginTop: 20 }}
            dataSource={formatStoryData(data?.data)}
            columns={columns as any}
            className="event-table-custom-gray event-table-gray-row-border"
            pagination={pagination}
            loading={isLoading}
            scroll={
              typeof window !== "undefined" && window.innerWidth < 600
                ? undefined
                : { y: `calc(100vh - 320px)` }
            }
          />
        </Spin>
      </div>
    </EditorProvider>
  );
};

export default Stories;
