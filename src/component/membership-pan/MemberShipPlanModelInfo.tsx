import React from 'react';
import { Modal, Card, Space, Typography } from 'antd';
import { CheckOutlined, IdcardOutlined } from '@ant-design/icons';
import { imageUrl } from "../../redux/api/baseApi";
const { Title, Text, Paragraph } = Typography;

// Define the membership plan type based on your data
interface MembershipFeature {
  _id: string;
  icon: string;
  title: string;
  description: string;
}

interface FamilyMembershipOptions {
  enableFamilyMembers: boolean;
}

interface MembershipPlan {
  _id: string;
  membershipType: string;
  logo: string;
  title: string;
  description: string;
  subDescription: string;
  features: MembershipFeature[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  familyMembershipOptions: FamilyMembershipOptions;
}

interface MemberShipPlanModalInfoProps {
  plan: MembershipPlan | null;
  open: boolean;
  onClose: () => void;
}

export const MemberShipPlanModalInfo: React.FC<MemberShipPlanModalInfoProps> = ({ 
  plan, 
  open, 
  onClose,
}) => {
  if (!plan) return null;


  return (
    <Modal 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      centered 
      width={500}
      styles={{
        body: { padding: '32px' }
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {/* Logo/Icon */}
        {plan.logo ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <img 
              src={`${imageUrl}${plan.logo}`}
              alt={plan.title}
              style={{
                width: 48,
                height: 48,
                objectFit: 'contain',
                borderRadius: 12
              }}
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#e8f4f8',
            marginBottom: 16
          }}>
            <IdcardOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          </div>
        )}
        
        <Title level={3} style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
          {plan.title}
        </Title>
        
        <Paragraph style={{ 
          color: '#666', 
          margin: 0,
          fontSize: 14
        }}>
          {plan.description}
        </Paragraph>
      </div>

      {/* Sub Description Card */}
      <Card 
        style={{ 
          backgroundColor: '#f8f9fa',
          border: 'none',
          marginBottom: 24,
          borderRadius: 8
        }}
      >
        <Text style={{ 
          color: '#666', 
          fontSize: 13,
          lineHeight: 1.6
        }}>
          {plan.subDescription}
        </Text>
      </Card>

      {/* Features Section */}
      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ 
          color: '#1890ff',
          fontWeight: 600,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: 20
        }}>
          ALL FEATURES INCLUDED
        </Title>

        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {plan.features.map((feature) => (
            <div 
              key={feature._id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}
            >
              {/* Feature Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: '#fef6ed',
                flexShrink: 0,
                overflow: 'hidden'
              }}>
                {feature.icon ? (
                  <img 
                    src={`${imageUrl}${feature.icon}`}
                    alt={feature.title}
                    style={{
                      width: 24,
                      height: 24,
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      // Fallback to colored div if image fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#d4a574'
                  }} />
                )}
              </div>
              
              {/* Feature Content */}
              <div style={{ flex: 1, paddingTop: 2 }}>
                <Text strong style={{ 
                  display: 'block',
                  color: '#262626',
                  fontSize: 14,
                  marginBottom: 2
                }}>
                  {feature.title}
                </Text>
                <Text style={{ 
                  color: '#8c8c8c',
                  fontSize: 13
                }}>
                  {feature.description}
                </Text>
              </div>

              {/* Checkmark */}
              <CheckOutlined style={{ 
                color: '#52c41a',
                fontSize: 16,
                flexShrink: 0,
                marginTop: 8
              }} />
            </div>
          ))}
        </Space>
      </div>

      {/* Optional: Show membership type badge */}
      {plan.membershipType && (
        <div style={{ 
          marginTop: 20,
          padding: '8px 12px',
          backgroundColor: '#e8f4f8',
          borderRadius: 6,
          textAlign: 'center'
        }}>
          <Text style={{ 
            fontSize: 12,
            color: '#1890ff',
            textTransform: 'uppercase',
            fontWeight: 600
          }}>
            {(plan.membershipType || "")
              .replace(/[-_]/g, ' ')?.toUpperCase()} Membership
          </Text>
        </div>
      )}
    </Modal>
  );
};