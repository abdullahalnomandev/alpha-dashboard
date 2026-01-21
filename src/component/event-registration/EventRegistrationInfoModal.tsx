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
}> = ({ registration, open, onClose }) => {

  console.log({registration})

 return (
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
            {(() => {
              const d = new Date(registration.createdAt);
              const day = d.getDate();
              const month = d.toLocaleString(undefined, { month: "long" });
              const year = d.getFullYear();
              let hours = d.getHours();
              const minutes = d.getMinutes().toString().padStart(2, "0");
              const ampm = hours >= 12 ? "PM" : "AM";
              hours = hours % 12;
              hours = hours === 0 ? 12 : hours;
              const time = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
              return `${day} ${month} ${year} at ${time}`;
            })()}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}
