import { Descriptions, Image, Modal, Row, Col } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { MembershipApplicationType } from ".";
import { imageUrl } from "../../redux/api/baseApi";

export const MemberShipApplicationInfoModel: React.FC<{
  open: boolean;
  application: MembershipApplicationType | null;
  onClose: () => void;
}> = ({ application, open, onClose }) => (
  <Modal open={open} onCancel={onClose} footer={null} centered width={750}>
    {application && (
      <div>
        {/* Profile Image */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          {application.profileImage && (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                overflow: "hidden",
                marginBottom: 8,
                display: "inline-block",
              }}
            >
              <Image
                src={imageUrl + application.profileImage}
                alt="Profile"
                preview={{
                  mask: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        borderRadius: "50%", // match the image rounding
                        backgroundColor: "rgba(0, 0, 0, 0.31)", // semi-dark hover
                      }}
                    >
                      <EyeOutlined style={{ color: "#fff", fontSize: 18 }} />
                    </div>
                  ),
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
          <div style={{ fontSize: 20, color: "#555" }}>{application.name}</div>
        </div>
        {/* Descriptions */}
        <Descriptions
          column={1}
          bordered
        >
          <Descriptions.Item label="Membership ID">
            {application.memberShipId}
          </Descriptions.Item>
          <Descriptions.Item label="Membership Type">
            <span
              style={{
                fontWeight: 500,
                fontSize: 15,
                padding: "2px 10px",
                display: "inline-block",
                color:
                  application.membershipType === "alpha"
                    ? "#334155"
                    : "#1c6758",
                backgroundColor:
                  application.membershipType === "alpha"
                    ? "#f8fafc"
                    : "#f6fffb",
                borderRadius: 6,
              }}
            >
              {application.membershipType?.replace(/_/g, " ")}
            </span>
          </Descriptions.Item>

          {/* Other Descriptions Items */}
          <Descriptions.Item label="Name">
            {application.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {application.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {application.phone}
          </Descriptions.Item>

          <Descriptions.Item label="Job Title">
            {application.jobTitle ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Organization">
            {application.organizationName ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {application.dateOfBirth
              ? dayjs(application.dateOfBirth).format("DD MMM YYYY")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Nationality">
            {application.nationality ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Country of Residence">
            {application.countryOfResidence ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Residence Address">
            {application.residenceAddress ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Industry Sector">
            {application.industrySector ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Years of Experience">
            {application.yearsOfExperience as number ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Current Employer">
            {application.currentEmployer ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Work Location">
            {application.workLocation ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Annual Gross Salary">
            {application.annualGrossSalary != null
              ? `$${application.annualGrossSalary}`
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Benefits & Lifestyle Interests">
            {application.benefitsAndLifestyleInterests?.join(", ") || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Confirm Acknowledgement">
            {application.confirmAcknowledgement ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Confirm Agreement">
            {application.confirmAgreement ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {application.address ?? "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span
              style={{
                color:
                  application.membershipStatus === "active"
                    ? "#52c41a"
                    : application.membershipStatus === "pending"
                      ? "#faad14"
                      : "#f5222d",
              }}
            >
              {application.membershipStatus.charAt(0).toUpperCase() +
                application.membershipStatus.slice(1)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Expires">
            {application.expireId
              ? dayjs(application.expireId).format("DD MMM YYYY")
              : "-"}
          </Descriptions.Item>

          {/* Images Array */}
          {application.image && application.image.length > 0 && (
            <Descriptions.Item label="Emirates ID">
              <Row gutter={[16, 16]}>
                <Image.PreviewGroup>
                  {application.image.map((img, idx) => (
                    <Col key={idx}>
                      <Image
                        src={imageUrl + img}
                        alt={`Attachment ${idx + 1}`}
                        width={100}
                        height={100}
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                        preview={{
                          mask: (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.45)",
                              }}
                            >
                              <EyeOutlined
                                style={{ color: "#fff", fontSize: 18 }}
                              />
                            </div>
                          ),
                        }}
                      />
                    </Col>
                  ))}
                </Image.PreviewGroup>
              </Row>
            </Descriptions.Item>
          )}

          {/* Logos Array */}
          {application.logo && application.logo.length > 0 && (
            <Descriptions.Item label="Passport">
              <Row gutter={[16, 16]}>
                <Image.PreviewGroup>
                  {application.logo.map((img, idx) => (
                    <Col key={idx}>
                      <Image
                        src={imageUrl + img}
                        alt={`Logo ${idx + 1}`}
                        width={100}
                        height={100}
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                        preview={{
                          mask: (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.45)",
                              }}
                            >
                              <EyeOutlined
                                style={{ color: "#fff", fontSize: 18 }}
                              />
                            </div>
                          ),
                        }}
                      />
                    </Col>
                  ))}
                </Image.PreviewGroup>
              </Row>
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Family Members */}
        {application.family && (application.family.spouse || (application.family.children && application.family.children.length > 0)) && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
              Family Members:
            </div>
            <Descriptions column={1} bordered>
              {/* Spouse */}
              {application.family.spouse && (
                <Descriptions.Item label="Spouse">
                  {application.family.spouse.name && <span>{application.family.spouse.name}</span>}
                  {application.family.spouse.dob && (
                    <span style={{ color: "#888" }}> (DOB: {new Date(application.family.spouse.dob).toLocaleDateString()})</span>
                  )}
                  {application.family.spouse.email && (
                    <span style={{ color: "#888" }}> | Email: {application.family.spouse.email}</span>
                  )}
                  {application.family.spouse.phone && (
                    <span style={{ color: "#888" }}> | Phone: {application.family.spouse.phone}</span>
                  )}
                </Descriptions.Item>
              )}

              {/* Children */}
              {application.family.children && application.family.children.length > 0 &&
                application.family.children.map((child, idx) => (
                  <Descriptions.Item key={idx} label={`Child ${idx + 1}`}>
                    {child.name} {child.age !== undefined && <span style={{ color: "#888" }}>(Age: {child.age})</span>}
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </div>
        )}
      </div>
    )}
  </Modal>
);
