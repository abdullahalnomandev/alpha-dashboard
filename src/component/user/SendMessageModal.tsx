import { Modal, Input, Typography } from 'antd'

type User = {
  _id: string;
  name?: string;
  email: string;
};

type SendMessageModalProps = {
  open: boolean;
  loading?: boolean;
  messageText: string;
  setMessageText: (v: string) => void;
  selectedUsers: User[];
  onOk: () => void;
  onCancel: () => void;
};

export default function SendMessageModal({
  open,
  loading = false,
  messageText,
  setMessageText,
  selectedUsers,
  onOk,
  onCancel
}: SendMessageModalProps) {

    
  return (
    <Modal
      title={`Send Message to ${selectedUsers.length === 0 ? "All" : selectedUsers?.length} Users`}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Send"
      cancelText="Cancel"
      destroyOnClose
      confirmLoading={loading}
      okButtonProps={{
        disabled: !messageText.trim(),
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <Typography.Text type="secondary">
          {selectedUsers.length > 0
            ? selectedUsers.length <= 5
              ? selectedUsers.map(u => u.name || u.email).join(", ")
              : `${selectedUsers.length === 0 ? "All" : selectedUsers?.length} users selected`
            : "All user will get notification"
          }
        </Typography.Text>
      </div>
      <Input.TextArea
        rows={5}
        value={messageText}
        onChange={e => setMessageText(e.target.value)}
        placeholder="Type your message..."
      />
    </Modal>
  );
}
