import { Modal, Descriptions, Avatar } from "antd";

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
  };
  event: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export const EventRegistrationInfoModal: React.FC<{
  registration: EventRegistrationInfoType | null;
  open: boolean;
  onClose: () => void;
}> = ({ registration, open, onClose }) => (
  <Modal
    open={open}
    title="Event Registration Details"
    onCancel={onClose}
    footer={null}
    centered
    width={500}
    destroyOnClose
  >
    {registration && (
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Registrant">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {registration.user.profileImage ? (
              <Avatar src={registration.user.profileImage} />
            ) : (
              <Avatar>{registration.user.name?.[0] || ""}</Avatar>
            )}
            <span>{registration.user.name}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {registration.user.email}
        </Descriptions.Item>
        {registration.user.phone && (
          <Descriptions.Item label="Phone">
            {registration.user.phone}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Status">
          {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
        </Descriptions.Item>
        <Descriptions.Item label="Registered At">
          {new Date(registration.createdAt).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Registrant ID">
          {registration.user._id}
        </Descriptions.Item>
        <Descriptions.Item label="Event ID">
          {registration.event}
        </Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
);
