import { Descriptions, Modal } from "antd";

export type FeedbackInfoType = {
  _id: string;
  partner: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
};

export const FeedbackInfoModel: React.FC<{
  feedback: FeedbackInfoType | null;
  open: boolean;
  onClose: () => void;
}> = ({ feedback, open, onClose }) => (
  <Modal open={open} onCancel={onClose} footer={null} centered width={500}>
    {feedback && (
      <>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#555" }}>
            Feedback Details
          </div>
        </div>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Partner Name">
            {feedback.partner?.name || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Partner Email">
            {feedback.partner?.email || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Rating">
            {feedback.rating} / 5
          </Descriptions.Item>
          <Descriptions.Item label="Comment">
            {feedback.comment || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {feedback.createdAt
              ? new Date(feedback.createdAt).toLocaleString()
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {feedback.updatedAt
              ? new Date(feedback.updatedAt).toLocaleString()
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </>
    )}
  </Modal>
);