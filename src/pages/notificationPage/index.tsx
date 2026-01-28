import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useGetNotificationsQuery, useUpdateNotificationMutation } from "../../redux/apiSlices/notificationSlice";
import { Spin, Pagination, Button } from "antd";
import { useNavigate } from "react-router-dom";

// Utility for date display
function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Professional notification colors
const COLOR_SEEN_BG = "#f6f8fa"; // subtle gray/neutral
const COLOR_UNSEEN_BG = "#eaf3ff"; // subtle blue
const COLOR_SEEN_TEXT = "#9aa5ba";
const COLOR_UNSEEN_TEXT = "#293146";
const COLOR_UNSEEN_BORDER = "#61a5fa";
const COLOR_HOVER_BG = "#e2ebfb";

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch notifications
  const { data,refetch, isLoading } = useGetNotificationsQuery({
    page,
    limit: pageSize,
  });
  const [updateNotification] = useUpdateNotificationMutation();

  // Get notifications (using _id as per model)
  const notifications: any[] = data?.data || [];
  const total = data?.pagination?.total ?? 0;
  const backendPage = data?.pagination?.page ?? 1;

  useEffect(() => {
    if (!isLoading && typeof backendPage === "number" && backendPage !== page) {
      setPage(backendPage);
    }
    // eslint-disable-next-line
  }, [backendPage, isLoading]);

  // Handle notification click: mark as seen if not yet, then redirect
  const handleNotificationClick = async (item: any) => {
    try {
      // 1️⃣ Mark as seen if not already
      if (!item.seen) {
        await updateNotification({
          id: item._id,
          data: { seen: true },
        }).unwrap();
  
        item.seen = true;
      }
    } catch (err) {
      // silently ignore
    }
  
    refetch();
  
    // 3️⃣ Navigate to the path
    if (item.path) {
      navigate(item.path);
    }
  };
  

  return (
    <div
      style={{
        background: "#f7fafd",
      }}
    >
      {/* Main Body */}
      <div
        style={{
          background: "#fff",
          borderRadius: 15,
          boxShadow: "0 1.5px 4px #e4e8ee, 0 6px 40px 0 #e3e6ee40",
          padding: "10px",
        }}
      >
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 320 }}>
            <Spin tip="Loading notifications..." size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              color: "#7A869A",
              textAlign: "center",
              padding: "48px 0",
              fontSize: 16,
              fontWeight: 500,
              background: "#f4f6fa",
              borderRadius: 12,
            }}
          >
            No notifications found.
            <div style={{ marginTop: 22 }}>
              <Button
                type="primary"
                onClick={() => navigate("/user/contact-from")}
              >
                Go to Contact Form
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifications?.map((item, idx) => {
              const seen = !!item.seen;
              // background and color based on seen/unseen
              const bgColor = seen ? COLOR_SEEN_BG : COLOR_UNSEEN_BG;
              const borderLeft = seen ? undefined : `3px solid ${COLOR_UNSEEN_BORDER}`;
              const titleColor = seen ? COLOR_SEEN_TEXT : COLOR_UNSEEN_TEXT;
              // subtle hover effect for unseen
              return (
                <div
                  key={item._id || idx}
                  tabIndex={0}
                  onClick={() => handleNotificationClick(item)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: bgColor,
                    borderRadius: 10,
                    // backgroundColor:'red',
                    borderLeft,
                    height: "calc(100vh - 35%)",
                    overflow:'hidden',
                    marginBottom: "0",
                    boxShadow: "0 0.5px 2.5px #e2e5ec29",
                    cursor: "pointer",
                    transition: "background 0.16s,border 0.15s",
                    outline: "none",
                  }}
                  onMouseOver={e => {
                    if (!seen) (e.currentTarget.style.background = COLOR_HOVER_BG);
                  }}
                  onMouseOut={e => {
                    if (!seen) (e.currentTarget.style.background = COLOR_UNSEEN_BG);
                  }}
                  onFocus={e => {
                    if (!seen) (e.currentTarget.style.background = COLOR_HOVER_BG);
                  }}
                  onBlur={e => {
                    if (!seen) (e.currentTarget.style.background = COLOR_UNSEEN_BG);
                  }}
                  aria-label={`Notification: ${item.title ?? "Email Notification"}`}
                >
                  <div
                    style={{
                      width: 50,
                      minWidth: 60,
                      height: 50,
                      background: seen ? "#f0f3f7" : "#e3eefd",
                      borderRadius: 8,
                      margin: "0 8px",
                      marginRight: 15,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: seen ? "1px solid #f0f3f7" : "1.5px solid #afd8fa",
                    }}
                  >
                    <FiBell style={{ fontSize: 21, color: seen ? "#aac2da" : "#2d8cff" }} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{
                      color: titleColor,
                      fontWeight: seen ? 400 : 600,
                      fontSize: 15,
                      letterSpacing: 0.14,
                      lineHeight: "19px",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap"
                    }}>
                      {item.title ?? "Email Notification"}
                      {!seen && (
                        <span style={{
                          marginLeft: 7,
                          fontSize: 9.5,
                          background: "#e1edf9",
                          color: "#2185d0",
                          borderRadius: 7,
                          padding: "2px 9px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          verticalAlign: "middle",
                        }}>
                          NEW
                        </span>
                      )}
                    </span>
                    <span style={{
                      color: seen ? "#b2b9c3" : "#345875",
                      fontSize: 13.3,
                      fontWeight: 400,
                      letterSpacing: 0.11,
                      marginTop: 1,
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}>
                      {item.message ?? "Lorem ipsum dolor sit amet, put all your content"}
                    </span>
                    <span style={{ color: "#94a3bb", fontSize: 12, marginTop: 2 }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  showSizeChanger={false}
                  onChange={newPage => setPage(newPage)}
                  style={{ background: "none" }}
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
