import { Descriptions, Modal } from "antd";

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
    <Modal open={open} onCancel={onClose} footer={null} centered width={400}>
      {story && (
        <>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#444" }}>
              {story.title}
            </div>
          </div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Club">
              {story.club && story.club.name ? (
                story.club.name
              ) : (
                <span style={{ color: "#888" }}>No club info</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {story.createdAt ? (
                new Date(story.createdAt).toLocaleString()
              ) : (
                <span style={{ color: "#888" }}>N/A</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};
