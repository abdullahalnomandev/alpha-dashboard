import { Modal, Typography } from "antd";
import { imageUrl } from "../../redux/api/baseApi";

export type StoryInfoType = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  club?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
  likeCount?: number;
};

export const StoryInfoModal: React.FC<{
  story: StoryInfoType | null;
  open: boolean;
  onClose: () => void;
}> = ({ story, open, onClose }) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} centered width={600} bodyStyle={{padding: 0}}>
      {story && (
        <div style={{ borderRadius: 12, marginTop:15, overflow: "hidden", background: "#fff" }}>
          {/* Image section */}
          <div style={{ width: "100%", height: 180, background: "#f6f6f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {story.image ? (
              <img
                src={`${imageUrl}${story.image}`}
                alt="story"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#bbb", fontSize: 15 }}>No image</span>
            )}
          </div>
          {/* Title & club */}
          <div style={{ padding: "18px 18px 0" }}>
            <Typography.Title level={4} style={{ margin: 0, color: "#242649" }}>
              {story.title}
            </Typography.Title>
            <div style={{ color: "#7d8597", marginTop: 3, marginBottom: 4, fontWeight: 500, fontSize: 15 }}>
              {story.club && story.club.name ? (
                story.club.name
              ) : (
                <span style={{ color: "#888" }}>No club information</span>
              )}
            </div>
            <div style={{ color: "#adadad", marginBottom: 7, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              {story.createdAt && (
                <>
                  <span role="img" aria-label="calendar" style={{}}>📅</span>
                  <span>
                    {new Date(story.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </>
              )}
              {story.likeCount !== undefined && (
                <>
                  <span role="img" aria-label="likes" style={{marginLeft: 12}}>❤️</span>
                  <span>{story.likeCount} Likes</span>
                </>
              )}
            </div>
            {/* Description HTML Preview */}
            <div style={{ margin: "14px 0 9px" }}>
              <Typography.Text strong style={{ fontSize: 15, color: "#264480" }}>
                Description
              </Typography.Text>
              <div
                style={{
                  borderRadius: 8,
                  // background: "#f6f8fa",
                  // padding: "12px 14px",
                  fontSize: 14,
                  marginTop: 7,
                  minHeight: 56,
                  color: "#3b3f47"
                }}
                dangerouslySetInnerHTML={{
                  __html: story.description
                    ? story.description
                    : '<span style="color:#bbb;">No description.</span>'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
