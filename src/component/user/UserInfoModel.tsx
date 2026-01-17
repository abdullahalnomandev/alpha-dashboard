import { Descriptions, Modal } from "antd";
import { type UserType } from ".";
import dayjs from "dayjs";

export const UserInfoModal: React.FC<{
  user: UserType | null;
  open: boolean;
  onClose: () => void;
}> = ({ user, open, onClose }) => (
  <Modal open={open} onCancel={onClose} footer={null} centered width={600}>
    {user && (
      <>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              style={{
                maxHeight: 180,
                objectFit: "cover",
                margin: "12px 0",
                maxWidth: "100%",
                borderRadius: 8,
              }}
            />
          ) : (
            <div
              style={{
                height: 120,
                width: 120,
                background: "#f5f5f5",
                borderRadius: 8,
                margin: "12px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              No image
            </div>
          )}
          <div style={{ fontSize: 20, color: "#555", marginTop: 8 }}>
            {user.name}
          </div>
        </div>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <span
              style={{
                color: user.status === "active" ? "#389e0d" : "#d4380d",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {user.status}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Verified">
            {user.verified ? (
              <span style={{ color: "#52c41a", fontWeight: 500 }}>Yes</span>
            ) : (
              <span style={{ color: "#f5222d", fontWeight: 500 }}>No</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <span style={{ textTransform: "capitalize" }}>{user.role}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Membership">
            {user.application_form?.membershipType
              ? user.application_form.membershipType?.replace(/_/g, " ")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {user.createdAt
              ? dayjs(user.createdAt).format("DD MMM YYYY")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </>
    )}
  </Modal>
);