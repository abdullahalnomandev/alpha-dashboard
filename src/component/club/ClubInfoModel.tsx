import { Descriptions, Modal } from "antd";
import { imageUrl } from "../../redux/api/baseApi";

export type ClubInfoType = {
  _id: string;
  image?: string;
  name: string;
  limitOfMember: number;
  numberOfMembers: number;
  description?: string;
  location?: string;
};

export const ClubInfoModel: React.FC<{
  club: ClubInfoType | null;
  open: boolean;
  onClose: () => void;
}> = ({ club, open, onClose }) => (
  <Modal open={open} onCancel={onClose} footer={null} centered width={600}>
    {club && (
      <>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          {club.image && (
            <img
              src={`${imageUrl}${club.image}`}
              alt={club.name}
              style={{
                maxHeight: 180,
                objectFit: "cover",
                margin: "12px 0",
                maxWidth: "100%",
                borderRadius: 8,
              }}
            />
          )}
          <div style={{ fontSize: 20, color: "#555" }}>{club.name}</div>
        </div>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Location">
            {club.location && club.location.trim().length > 0
              ? club.location
              : <span style={{ color: "#888" }}>No location</span>}
          </Descriptions.Item>
          <Descriptions.Item label="Member">
            {club.limitOfMember}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Number of Members">
            {club.numberOfMembers}
          </Descriptions.Item> */}
        </Descriptions>
      </>
    )}
  </Modal>
);
