import { Descriptions, Image, Modal } from "antd";
import dayjs from "dayjs";
import type { PartnerShipApplicationType } from ".";
import { EyeOutlined } from "@ant-design/icons";
import { imageUrl } from "../../redux/api/baseApi";

export const PartnerShipApplicationInfoModel: React.FC<{
  open: boolean;
  application: PartnerShipApplicationType | null;
  onClose: () => void;
}> = ({ application, open, onClose }) => (
  <Modal open={open} onCancel={onClose} footer={null} centered width={750}>
    {application && (
      <div>
        {/* Profile Image */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          {application.profileImage && (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                marginBottom: 8,
                display: "inline-block",
              }}
            >
              <Image
                src={imageUrl + application.profileImage}
                alt="Profile"
                preview={{
                  mask: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        borderRadius: "50%", // match the image rounding
                        backgroundColor: "rgba(0, 0, 0, 0.31)", // semi-dark hover
                      }}
                    >
                      <EyeOutlined style={{ color: "#fff", fontSize: 18 }} />
                    </div>
                  ),
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          <div style={{ fontSize: 20, color: "#555" }}>{application.contactName}</div>
        </div>
        {/* Company Info */}
        <Descriptions column={1} bordered>
          <Descriptions.Item label="PartnerShip ID">
            {application.partnerShipId}
          </Descriptions.Item>
          <Descriptions.Item label="Company Name">
            {application.companyName}
          </Descriptions.Item>
          <Descriptions.Item label="Industry">
            {application.industry}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Name">
            {application.contactName}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Email">
            {application.contactEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Phone">
            {application.contactPhone}
          </Descriptions.Item>
          <Descriptions.Item label="Website">
            {application.website}
          </Descriptions.Item>
          <Descriptions.Item label="Message">
            {application.message}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span
              style={{
                color:
                  application.partnerShipStatus === "active"
                    ? "#52c41a"
                    : application.partnerShipStatus === "pending"
                      ? "#faad14"
                      : "#f5222d",
                fontWeight: 500,
              }}
            >
              {application.partnerShipStatus
                ? application.partnerShipStatus.charAt(0).toUpperCase() +
                application.partnerShipStatus.slice(1)
                : "-"}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {application.createdAt
              ? dayjs(application.createdAt).format("DD MMM YYYY")
              : "-"}
          </Descriptions.Item>
        </Descriptions>

      </div>
    )}
  </Modal>
);