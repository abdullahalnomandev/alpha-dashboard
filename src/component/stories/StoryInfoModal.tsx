import { Modal, Carousel, Typography } from "antd";
import { imageUrl } from "../../redux/api/baseApi";

export type StoryInfoType = {
  _id: string;
  title: string;
  description?: string;
  image?: string | string[];
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
  if (!story) return null;

  // Normalize image(s) field to an array
  const rawImages = story.image;
  const images: string[] = Array.isArray(rawImages)
    ? rawImages.filter(Boolean)
    : typeof rawImages === "string" && rawImages
    ? [rawImages]
    : [];

  const imageUrls = images.map((img) =>
    img.startsWith("http") ? img : `${imageUrl}/${img.replace(/^\/+/, "")}`
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      destroyOnHidden
      title={null}
      styles={{
        body: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
        },
      }}
      style={{ borderRadius: 16, padding: 0 }}
    >
      <div
        style={{
          borderRadius: 16,
          marginTop: 10,
          overflow: "hidden",
          background: "#fff",
          fontFamily: "inherit",
        }}
      >
        {/* Top: Images */}
        <div
          style={{
            width: "100%",
            marginTop: 18,
            background: "#f6f8fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imageUrls.length ? (
            <div style={{ width: "100%" }}>
              <Carousel
                dots
                autoplay={imageUrls.length > 1}
                autoplaySpeed={3000}
                draggable
                adaptiveHeight={false}
                waitForAnimate
                speed={1500}
              >
                {imageUrls.map((src, idx) => (
                  <div key={`${src}-${idx}`}>
                    <div
                      style={{
                        width: "100%",
                        height: 260,
                        background: "#f6f8fa",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={src}
                        alt={`story-${idx + 1}`}
                        style={{
                          width: "100%",
                          height: 260,
                          objectFit: "contain",
                          display: "block",
                          background: "#f6f8fa",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: 180,
                background: "#f6f8f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#bbb",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              No image
            </div>
          )}
        </div>
        {/* Main info card */}
        <div style={{ padding: "22px 24px 0 24px", background: "#fff" }}>
          {/* Title & club */}
          <Typography.Title
            level={4}
            style={{ margin: 0, color: "#242649", fontWeight: 600 }}
          >
            {story.title}
          </Typography.Title>
          <div
            style={{
              color: "#7d8597",
              marginTop: 3,
              marginBottom: 4,
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            {story.club && story.club.name ? (
              story.club.name
            ) : (
              <span style={{ color: "#888" }}>No club information</span>
            )}
          </div>
          <div
            style={{
              color: "#adadad",
              marginBottom: 9,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {story.createdAt && (
              <>
                <span role="img" aria-label="calendar">
                  📅
                </span>
                <span>
                  {new Date(story.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
            {story.likeCount !== undefined && (
              <>
                <span role="img" aria-label="likes">
                  ❤️
                </span>
                <span>{story.likeCount} Likes</span>
              </>
            )}
          </div>
          {/* Description HTML Preview */}
          <div style={{ margin: "14px 0 16px" }}>
            <Typography.Text
              strong
              style={{ fontSize: 15, color: "#264480", marginBottom: 0 }}
            >
              Description
            </Typography.Text>
            <div
              style={{
                borderRadius: 8,
                fontSize: 14,
                marginTop: 7,
                minHeight: 56,
                color: "#3b3f47",
                maxHeight: 300,
                overflowY: "auto",
              }}
              dangerouslySetInnerHTML={{
                __html: story.description
                  ? story.description
                  : '<span style="color:#bbb;">No description provided.</span>',
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
