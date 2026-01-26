import { Descriptions, Modal, Progress } from "antd";
import type { ClubType } from ".";
import { imageUrl } from "../../redux/api/baseApi";

export const ClubInfoModal: React.FC<{
    club: ClubType | null;
    open: boolean;
    onClose: () => void;
  }> = ({ club, open, onClose }) => {
    const percentage = club ? (club.limitOfMember > 0 ? (club.numberOfMembers / club.limitOfMember) * 100 : 0) : 0;
    
    return (
      <Modal open={open} onCancel={onClose} footer={null} centered width={600}>
        {club && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              {club.image && (
                <img
                  src={`${imageUrl}${club.image}`}
                  alt={club.name}
                  style={{
                    maxHeight: 180,
                    objectFit: "cover",
                    margin: "12px 0",
                    maxWidth: "100%",
                    borderRadius: 8,
                  }}
                />
              )}
              <div style={{ fontSize: 20, color: "#555" }}>{club.name}</div>
            </div>
  
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Club Name">
                {club.name}
              </Descriptions.Item>
              <Descriptions.Item label="Members">
                <div style={{ width: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>{club.numberOfMembers}/{club.limitOfMember} members</span>
                    <span style={{ fontSize: 12, color: '#666' }}>{Math.round(percentage)}% full</span>
                  </div>
                  <Progress 
                    percent={percentage} 
                    status={percentage >= 100 ? 'exception' : percentage >= 80 ? 'active' : 'normal'}
                  />
                </div>
              </Descriptions.Item>
              {club.description && (
                <Descriptions.Item label="Description">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: club.description,
                    }}
                  />
                </Descriptions.Item>
              )}
            </Descriptions>
          </>
        )}
      </Modal>
    );
  };