import { Modal } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";

export type ClubInfoType = {
  _id: string;
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
};

export const ContactInfoModel: React.FC<{
  club: ClubInfoType | null;
  open: boolean;
  onClose: () => void;
}> = ({ club, open, onClose }) => (
  <Modal
    open={open}
    title="Contact Details"
    onCancel={onClose}
    footer={null}
    centered
    width={400}
    destroyOnClose
  >
    {club && (
      <div className="space-y-2">
        {/* Name & Title */}
        <div>
          <h3 style={{ margin: 0 }}>{club.name}</h3>
          {club.title && <p style={{ margin: 0, color: "#888" }}>{club.title}</p>}
        </div>

        {/* Contact Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {club.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PhoneOutlined />
              <span>{club.phone}</span>
            </div>
          )}
          {club.email && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MailOutlined />
              <span>{club.email}</span>
            </div>
          )}
          {club.location && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <EnvironmentOutlined />
              <span>{club.location}</span>
            </div>
          )}
        </div>
      </div>
    )}
  </Modal>
);