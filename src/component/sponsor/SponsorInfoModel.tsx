import { Modal } from "antd";

export type SponsorInfoType = {
  _id: string;
  logo?: string;
  title: string;
  location?: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const SponsorInfoModel: React.FC<{
  sponsor: SponsorInfoType | null;
  open: boolean;
  onClose: () => void;
}> = ({ sponsor, open, onClose }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      destroyOnClose
    >
      {sponsor && (
        <>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#444" }}>
              {sponsor.title}
            </div>
          </div>
          {/* Show location at the top left, above description */}
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                fontSize: 15,
                color: "#888",
                marginBottom: 0,
                marginLeft: 2,
                fontWeight: 400,
                marginTop: 0,
              }}
            >
              Location: {sponsor.location ? sponsor.location : <span style={{ color: "#bbb" }}>No location</span>}
            </div>
          </div>
          {/* Show description as HTML at the bottom */}
          {sponsor.description && (
            <div
              style={{
                marginTop: 20,
                padding: "16px 10px",
                background: "#fafbfc",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
                minHeight: 60,
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: sponsor.description }}
            />
          )}
        </>
      )}
    </Modal>
  );
};
