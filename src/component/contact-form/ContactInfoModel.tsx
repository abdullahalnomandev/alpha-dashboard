import { Modal, Descriptions } from "antd";

export type ClubInfoType = {
  _id: string;
  name: string;
  limitOfMember: number;
  numberOfMembers: number;
  description?: string;
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
    width={500}
    destroyOnClose
  >
    {club && (
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Name">
          {club.name}
        </Descriptions.Item>
        <Descriptions.Item label="Contact">
          {
            // In the latest pattern, some fields like contact/email/message are included via description property as a ReactNode
            club.description && typeof club.description !== "string"
              ? club.description
              : club.description
          }
        </Descriptions.Item>
        {club.location && (
          <Descriptions.Item label="Location">
            {club.location || <span style={{ color: "#888" }}>No location</span>}
          </Descriptions.Item>
        )}
        {typeof club.limitOfMember === "number" && (
          <Descriptions.Item label="Member">
            {club.limitOfMember}
          </Descriptions.Item>
        )}
        {typeof club.numberOfMembers === "number" && (
          <Descriptions.Item label="Number of Members">
            {club.numberOfMembers}
          </Descriptions.Item>
        )}
      </Descriptions>
    )}
  </Modal>
);
