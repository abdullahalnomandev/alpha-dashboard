import { Descriptions, Modal } from "antd";
import dayjs from "dayjs";
import type { MembershipApplicationType } from ".";



export const MemberShipApplicationInfoModel: React.FC<{
  open: boolean;
  application: MembershipApplicationType | null;
  onClose: () => void;
}> = ({ application, open, onClose }) => (

  
  <Modal open={open} onCancel={onClose} footer={null} centered width={600}>
    {application && (
      <>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 20, color: "#555" }}>{application.name}</div>
        </div>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Membership ID">
            {application.memberShipId}
          </Descriptions.Item>
          <Descriptions.Item label="Membership Type">
            {(() => {
              const MEMBERSHIP_TYPE_STYLES: Record<string, React.CSSProperties> = {
                alpha: {
                  color: "#334155",
                  background: "#f8fafc",
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 15,
                  padding: "2px 10px",
                  display: "inline-block",
                },
                alpha_family: {
                  color: "#1c6758",
                  background: "#f6fffb",
                  borderRadius: 6,
                  fontWeight: 500,
                  fontSize: 15,
                  padding: "2px 10px",
                  display: "inline-block",
                },
              };
              const style =
                MEMBERSHIP_TYPE_STYLES[application.membershipType] || {
                  fontWeight: 500,
                  fontSize: 15,
                  padding: "2px 10px",
                  display: "inline-block",
                };
              return (
                <span style={style}>
                  {application.membershipType?.replace(/_/g, " ")}
                </span>
              );
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            {application.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {application.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {application.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {application.address ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span
              style={{
                color:
                  application.membershipStatus === "active"
                    ? "#52c41a"
                    : application.membershipStatus === "pending"
                    ? "#faad14"
                    : "#f5222d",
              }}
            >
              {application.membershipStatus.charAt(0).toUpperCase() +
                application.membershipStatus.slice(1)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Expires">
            {application.expireId
              ? dayjs(application.expireId).format("DD MMM YYYY")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
        
        {application.familyMembers && application.familyMembers.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
              Family Members:
            </div>
            <Descriptions column={1} bordered>
              {application.familyMembers.map((fm, idx) => (
                <Descriptions.Item
                  key={idx}
                  label={`${fm.relation}`}
                >
                  {fm.name}{" "}
                  <span style={{ color: "#888" }}>
                    {fm.email ? `(${fm.email})` : ""}
                  </span>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        )}
      </>
    )}
  </Modal>
);