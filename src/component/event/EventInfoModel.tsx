import { Descriptions, Modal } from "antd";
import { formatTime12Hour, type EventType } from ".";
import { imageUrl } from "../../redux/api/baseApi";
import dayjs from "dayjs";

export const EventInfoModal: React.FC<{
    event: EventType | null;
    open: boolean;
    onClose: () => void;
  }> = ({ event, open, onClose }) => (
    <Modal open={open} onCancel={onClose} footer={null} centered width={600}>
      {event && (
        <>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {event.image && (
              <img
                src={`${imageUrl}/${event.image}`}
                alt={event.name}
                style={{
                  maxHeight: 180,
                  objectFit: "cover",
                  margin: "12px 0",
                  maxWidth: "100%",
                  borderRadius: 8,
                }}
              />
            )}
            <div style={{ fontSize: 20, color: "#555" }}>{event.name}</div>
          </div>
  
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Title">
              {event.title}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {event.location}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {event.eventDate
                ? dayjs(event.eventDate).format("DD MMM YYYY")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Time">
              {event.eventTime ? formatTime12Hour(event.eventTime) : "-"}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
  