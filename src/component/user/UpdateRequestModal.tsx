import { Modal, Image, Button, Space, Typography } from "antd";
import type { UserType } from ".";
import { imageUrl } from "../../redux/api/baseApi";
const { Text } = Typography;

const UpdateRequestModal = ({
  open,
  user,
  onClose,
  loading,
  onAccept,
  onReject,
}: {
  open: boolean;
  user: UserType | null;
  loading: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}) => {
  const req = user?.profileUpdateRequest;
  if (!req) return null;

  const imageSrc = req.profileImage?.startsWith("http")
    ? req.profileImage
    : imageUrl + req.profileImage;
  return (
    <Modal
      open={open}
      title="Profile Update Request"
      onCancel={onClose}
      footer={null}
      centered
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {req?.name && (
          <div>
            <Text strong>Name</Text>
            <div>{req.name || "-"}</div>
          </div>
        )}
        {req?.profileImage && (
          <div>
            <Text strong>Profile Image</Text>
            <br />
            {req.profileImage ? (
              <Image
                src={imageSrc}
                width={120}
                height={120}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <Text type="secondary">No image</Text>
            )}
          </div>
        )}

        <Space style={{ justifyContent: "flex-end", width: "100%" }}>
          <Button danger onClick={onReject} loading={loading}>
            Reject
          </Button>
          <Button type="primary" onClick={onAccept} loading={loading}>
            Accept
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default UpdateRequestModal;
