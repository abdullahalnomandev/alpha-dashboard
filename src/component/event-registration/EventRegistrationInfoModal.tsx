import {
  Modal,
  Descriptions,
  Avatar,
  List,
  Tag,
  Divider,
  Typography,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  UsergroupAddOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

const { Title, Text } = Typography;

export type GuestType = {
  name: string;
  email: string;
  phone?: string;
  _id: string;
};

export type EventRegistrationInfoType = {
  _id: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
    email: string;
    phone?: string;
    status?: string;
    role?: string;
    verified?: boolean;
    hasPasswordSave?: boolean;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
    fcmToken?: string;
    industry?: string; // added opt industry
  };
  event: string;
  guests?: GuestType[];
  status: string;
  createdAt: string;
  updatedAt: string;
};

// Modern professional palette
const primaryColor = "#174e91";
const accentColor = "#1677ff";
const bgColor = "#f7fafd";
const whiteBg = "#fff";
const darkText = "#222b45";
const softBorder = "#e6eaf3";
const textSecondary = "#6f7a92";
const industryTagColor = "geekblue";
const statusDisplay: Record<
  string,
  {
    text: string;
    color: string;
    icon?: React.ReactNode;
  }
> = {
  confirmed: {
    text: "Booking Confirmed",
    color: "#52c41a", // green
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 6 }} />,
  },
  cancelled: {
    text: "Booking Cancelled",
    color: "#ff4d4f", // red
    icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ marginRight: 6 }} />,
  },
  pending: {
    text: "Booking Pending",
    color: "#faad14", // orange/yellow
    icon: <CloseCircleTwoTone twoToneColor="#faad14" style={{ marginRight: 6 }} />,
  },
  // Fallback for unhandled statuses
  approved: {
    text: "Approved",
    color: "#1890ff",
  },
  completed: {
    text: "Completed",
    color: "#1890ff",
  },
  rejected: {
    text: "Rejected",
    color: "#ff4d4f",
  },
};

export const EventRegistrationInfoModal: React.FC<{
  registration: EventRegistrationInfoType | null;
  open: boolean;
  onClose: () => void;
}> = ({ registration, open, onClose }) => {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString(undefined, { month: "short" });
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const time = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
    return `${day} ${month} ${year}, ${time}`;
  };

  // Determine correct status display config
  const getStatusDisplay = (status: string) => {
    // Default safe fallback
    const lower = status.toLowerCase();
    if (statusDisplay[lower]) return statusDisplay[lower];
    return {
      text: status.charAt(0).toUpperCase() + status.slice(1),
      color: accentColor,
    };
  };

  return (
    <Modal
      open={open}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
            fontSize: 20,
            color: primaryColor,
            letterSpacing: 0.1,
          }}
        >
          <UsergroupAddOutlined style={{ fontSize: 26, color: accentColor }} />
          <span>Event Registration Details</span>
        </div>
      }
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      destroyOnHidden
      styles={{
        body: {
          background: bgColor,
          borderRadius: 16,
          padding: "0 0 24px 0",
          minHeight: 420,
        }
      }}
    >
      {registration && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              background: whiteBg,
              marginBottom:10,
              borderRadius: 10,
              padding: "28px 26px 15px 26px",
              boxShadow: "0 2px 14px 0 #e5eaf5aa",
              border: `1px solid ${softBorder}`,
            }}
          >
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", height: 64 }}>
              {registration.user.profileImage ? (
                <Avatar
                  src={
                    registration.user?.profileImage
                      ? registration.user.profileImage.startsWith("http") ||
                      registration.user.profileImage.startsWith("https")
                        ? registration.user.profileImage
                        : imageUrl + registration.user.profileImage
                      : undefined
                  }
                  size={64}
                  style={{
                    border: `3px solid ${accentColor}`,
                  }}
                />
              ) : (
                <Avatar
                  style={{
                    background: accentColor,
                    fontSize: 32,
                    border: `3px solid ${softBorder}`,
                    color: "#fff",
                  }}
                  size={64}
                  icon={<UserOutlined />}
                >
                  {registration.user.name?.[0]?.toUpperCase() || ""}
                </Avatar>
              )}
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center", minWidth: 0 }}>
              <Title
                level={4}
                style={{
                  color: darkText,
                  fontWeight: 700,
                  fontSize: 19,
                  margin: 0,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {registration.user.name}
              </Title>
            </div>
          </div>
          <Descriptions
            column={1}
            bordered
            size="middle"
            labelStyle={{
              fontWeight: 700,
              fontSize: 15,
              color: primaryColor,
              minWidth: 120,
              padding: "8px 16px",
            }}
       
            style={{
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 1px 10px #e8eefb40",
              border: `1px solid ${softBorder}`,
              marginBottom: 8,
            }}
          >
            <Descriptions.Item label={<span>Email</span>}>
              <Text copyable style={{ color: accentColor, fontWeight: 500 }}>
                {registration.user.email}
              </Text>
            </Descriptions.Item>
            {registration.user.phone && (
              <Descriptions.Item label={<span>Phone</span>}>
                <Text style={{fontWeight: 500 }}>
                  {registration.user.phone}
                </Text>
              </Descriptions.Item>
            )}
            {/* Industry professional label */}
            {registration.user.industry && (
              <Descriptions.Item
                label={
                  <span>
                    <Tag
                      color={industryTagColor}
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: 0.4,
                        margin: 0,
                        color: primaryColor,
                        border: `1px solid ${softBorder}`,
                        borderRadius: 5,
                      }}
                    >
                      Industry
                    </Tag>
                  </span>
                }
              >
                <Tag
                  color={industryTagColor}
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    background: whiteBg,
                    margin: 0,
                    color: primaryColor,
                    border: `1px solid ${softBorder}`,
                    borderRadius: 5,
                  }}
                >
                  {registration.user.industry}
                </Tag>
              </Descriptions.Item>
            )}
            <Descriptions.Item label={<span>Status</span>}>
              {(() => {
                const stat = getStatusDisplay(registration.status);
                return (
                  <span style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
                    {stat.icon}
                    <Text style={{ color: stat.color, fontWeight: 500 }}>
                      {stat.text}
                    </Text>
                  </span>
                );
              })()}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  Registered At
                </span>
              }
            >
              <Text type="secondary" style={{ color: textSecondary }}>
                {formatDate(registration.createdAt)}
              </Text>
            </Descriptions.Item>
            {registration.guests &&
              Array.isArray(registration.guests) &&
              registration.guests.length > 0 && (
                <Descriptions.Item
                  label={
                    <span>
                      <UsergroupAddOutlined
                        style={{ color: primaryColor, marginRight: 6 }}
                      />
                      Guests
                    </span>
                  }
                >
                  <List
                    size="small"
                    dataSource={registration.guests}
                    style={{
                      borderRadius: 6,
                      margin: "4px 0",
                    }}
                    renderItem={(guest, index) => (
                      <List.Item
                        key={guest._id || index}
                        style={{
                          background: whiteBg,
                          borderRadius: 5,
                          marginBottom: 5,
                          boxShadow: "0 1px 4px #dde9ff14",
                          padding: "12px 14px",
                          border: `1px solid ${softBorder}`,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Space
                          direction="vertical"
                          size={2}
                          style={{ width: "100%" }}
                        >
                          <Text
                            strong
                            style={{
                              color: primaryColor,
                              fontSize: 15,
                              letterSpacing: 0.2,
                            }}
                          >
                            {guest.name}
                          </Text>
                          <Space size={8}>
                            <MailOutlined
                              style={{ color: accentColor, fontSize: 15 }}
                            />
                            <Text
                              copyable
                              style={{ color: accentColor, fontWeight: 500 }}
                            >
                              {guest.email}
                            </Text>
                          </Space>
                          {guest.phone && (
                            <Space size={8}>
                              <PhoneOutlined
                                style={{ fontSize: 15 }}
                              />
                              <Text   >
                                {guest.phone}
                              </Text>
                            </Space>
                          )}
                        </Space>
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              )}
          </Descriptions>
          <Divider style={{ margin: "32px 0 0", borderColor: softBorder }} />
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <Text
              type="secondary"
              style={{
                fontSize: 13.5,
                color: textSecondary,
                letterSpacing: 0.2,
              }}
            >
              Thank you for registering. Our team will reach out if further
              action is needed.
            </Text>
          </div>
        </div>
      )}
    </Modal>
  );
};
