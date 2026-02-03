import { useState } from "react";
import { FiBell } from "react-icons/fi";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "../../redux/apiSlices/notificationSlice";
import { Spin, Pagination, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";

/* ---------- Utils ---------- */
function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ---------- Colors ---------- */
const COLOR_SEEN_BG = "#f6f8fa";
const COLOR_UNSEEN_BG = "#eaf3ff";
const COLOR_UNSEEN_BORDER = "#61a5fa";
const COLOR_HOVER_BG = "#e2ebfb";

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, refetch } = useGetNotificationsQuery({
    page,
    limit: pageSize,
  });

  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification, { isLoading: deleteLoading }] = useDeleteNotificationMutation();

  const notifications = data?.data || [];
  const total = data?.pagination?.total ?? 0;

  const handleClick = async (item: any) => {
    if (!item.seen) {
      await updateNotification({
        id: item._id,
        data: { seen: true },
      });
      refetch();
    }
    if (item.path) navigate(item.path);
  };

  return (
    <div
      style={{
        background: "#f7fafd",
        height: "100vh",
        padding: 12,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 15,
          padding: 10,
          boxShadow: "0 1.5px 4px #e4e8ee",
          height: "calc(100vh - 150px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          /* 🔄 Centered Loader */
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin size="large" tip="Loading notifications..." />
          </div>
        ) : (
          <>
            {/* 🔹 Scrollable list */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                paddingRight: 4,
              }}
            >
              {notifications.map((item: any) => {
                const seen = item.seen;

                return (
                  <div
                    key={item._id}
                    className="notification-item"
                    onClick={() => handleClick(item)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: seen ? COLOR_SEEN_BG : COLOR_UNSEEN_BG,
                      borderLeft: seen
                        ? undefined
                        : `3px solid ${COLOR_UNSEEN_BORDER}`,
                      borderRadius: 10,
                      padding: "10px 8px",
                      marginBottom: 10,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!seen)
                        e.currentTarget.style.background = COLOR_HOVER_BG;
                    }}
                    onMouseLeave={(e) => {
                      if (!seen)
                        e.currentTarget.style.background = COLOR_UNSEEN_BG;
                    }}
                  >
                    {/* Icon */}
                    <div style={{ margin: "0 12px" }}>
                      <FiBell
                        size={20}
                        color={seen ? "#9aa5ba" : "#2d8cff"}
                      />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: seen ? 400 : 600 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: "#5f6b7a" }}>
                        {item.message}
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3bb" }}>
                        {formatDate(item.createdAt)}
                      </div>
                    </div>

                    {/* Delete (hover only) */}
                    <div className="delete-action">
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={deleteLoading ? <LoadingOutlined /> : <DeleteOutlined />}
                        onClick={async (e) => {
                          e.stopPropagation();
                          await deleteNotification(item._id);
                          refetch();
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🔹 Fixed Pagination */}
            <div
              style={{
                borderTop: "1px solid #eef1f6",
                paddingTop: 10,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                showSizeChanger={false}
                onChange={(p) => setPage(p)}
              />
            </div>
          </>
        )}
      </div>

      {/* 🔹 Hover CSS */}
      <style>
        {`
          .delete-action {
            opacity: 0;
            transform: translateX(6px);
            transition: all 0.15s ease;
          }

          .notification-item:hover .delete-action {
            opacity: 1;
            transform: translateX(0);
          }
        `}
      </style>
    </div>
  );
};

export default NotificationPage;
