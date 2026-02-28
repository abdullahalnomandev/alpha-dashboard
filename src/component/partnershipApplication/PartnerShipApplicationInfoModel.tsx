import { Descriptions, Modal } from "antd";
import dayjs from "dayjs";
import type { PartnerShipApplicationType } from ".";

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