import { Modal } from "antd";
import { formatTime12Hour, type EventType } from ".";
import { imageUrl } from "../../redux/api/baseApi";
import dayjs from "dayjs";

export const EventInfoModal: React.FC<{
  event: EventType | null;
  open: boolean;
  onClose: () => void;
}> = ({ event, open, onClose }) => {
  if (!event) return null;

  // Single image handling (not carousel)
  let imgUrl: string | undefined =
    event.image &&
    (event.image.startsWith("http")
      ? event.image
      : `${imageUrl}/${event.image.replace(/^\/+/, "")}`);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      bodyStyle={{
        padding: 0,
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
      }}
      style={{ borderRadius: 16, padding: 0 }}
      title={null}
      destroyOnClose
    >
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          background: "#fff",
          fontFamily: "inherit",
        }}
      >
        {/* Top: Image */}
        <div
          style={{
            width: "100%",
            marginTop: 20,
            background: "#f6f8fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imgUrl ? (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  height: 220,
                  background: "#f6f8fa",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={imgUrl}
                  alt={event.name}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "contain",
                    display: "block",
                    background: "#f6f8fa",
                    borderRadius: 0,
                  }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: 160,
                background: "#f6f8f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ccc",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              No image
            </div>
          )}
        </div>
        {/* Main info card */}
        <div
          style={{
            padding: "20px 22px 0 22px",
            background: "#fff",
          }}
        >
          {/* Title, event name */}
          <div
            style={{
              fontSize: 19,
              fontWeight: 600,
              color: "#294183",
              marginBottom: 4,
            }}
          >
            {event.title}
          </div>
          <div
            style={{
              color: "#555a6a",
              fontWeight: 500,
              fontSize: 16,
              marginBottom: 12,
            }}
          >
            {event.name}
          </div>
          {/* Location and date/time */}
          <div
            style={{
              marginBottom: 10,
              color: "#fa541c",
              fontSize: 15,
              fontWeight: 500,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span>
              <b style={{ color: "#25396d" }}>Location:</b>{" "}
              <span style={{ color: "#fa541c" }}>
                {event.location || "-"}
              </span>
            </span>
            <span>
              <b style={{ color: "#25396d" }}>Date:</b>{" "}
              <span style={{ color: "#294183" }}>
                {event.eventDate
                  ? dayjs(event.eventDate).format("DD MMM YYYY")
                  : "-"}
              </span>
            </span>
            <span>
              <b style={{ color: "#25396d" }}>Time:</b>{" "}
              <span style={{ color: "#294183" }}>
                {event.eventTime ? formatTime12Hour(event.eventTime) : "-"}
              </span>
            </span>
          </div>
          {/* Description */}
          <div
            style={{
              fontWeight: 500,
              color: "#253347",
              fontSize: 16,
              marginBottom: 0,
            }}
          >
            Description
          </div>
          <div
            style={{
              color: "#777D8F",
              fontSize: 14,
              marginBottom: 18,
              marginTop: 2,
              minHeight: 22,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {"description" in event && (event as any).description ? (
              <span
                style={{ display: "block" }}
                dangerouslySetInnerHTML={{
                  __html: (event as any).description,
                }}
              />
            ) : (
              <span style={{ color: "#bbb" }}>No description provided.</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
