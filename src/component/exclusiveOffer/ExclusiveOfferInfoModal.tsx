import { Modal } from "antd";
import type { ExclusiveOfferType } from ".";
import { imageUrl } from "../../redux/api/baseApi";
import { EnvironmentFilled } from "@ant-design/icons";

export const ExclusiveOfferInfoModal: React.FC<{
  open: boolean;
  data: ExclusiveOfferType | null;
  onClose: () => void;
}> = ({ open, data, onClose }) => {
  if (!data) return null;

  // Compose image URL
  const imageSrc =
    "image" in data && (data as any).image
      ? (data as any).image?.startsWith("http")
        ? (data as any).image
        : imageUrl + "/" + ((data as any)?.image || "")?.replace(/^\/+/, "")
      : null;

  // Determine location (address or similar field)
  const locationStr =
    (data as any).address ||
    (data as any).location ||
    "";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      destroyOnClose
      title={null}
      bodyStyle={{
        padding: 0,
        borderRadius: 16,
        overflow: "hidden"
      }}
      style={{ borderRadius: 16, padding: 0 }}
    >
      <div style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        fontFamily: "inherit"
      }}>
        {/* Top: Image */}
        <div style={{ width: "100%", height: 180, background: "#f6f8fa" }}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="offer"
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: "0 0 0 0"
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 180,
                background: "#f6f8f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ccc",
                fontSize: 22,
                fontWeight: 500
              }}
            >
              No image
            </div>
          )}
        </div>
        {/* Main info card */}
        <div style={{
          padding: "20px 22px 0 22px",
          background: "#fff"
        }}>
          {/* Title, restaurant name */}
          <div style={{ fontSize: 19, fontWeight: 600, color: "#294183", marginBottom: 4 }}>
            {data.title}
          </div>
          <div style={{ color: "#555a6a", fontWeight: 500, fontSize: 16, marginBottom: 7 }}>
            {data.name}
          </div>
          {/* Address/Location */}
          {(!!locationStr || !!data.category?.name) && (
            <div style={{
              display: "flex",
              alignItems: "center",
              color: "#fa541c",
              fontSize: 14,
              marginBottom: 12
            }}>
              <EnvironmentFilled style={{ marginRight: 5, fontSize: 15, color: "#fa541c" }} />
              <span>{locationStr ? locationStr : "-"}</span>
              {/* Optionally show category name as a separate visual info */}
              {data.category?.name && (
                <span style={{
                  color: "#25396d",
                  marginLeft: 8,
                  fontWeight: 400,
                  fontSize: 13,
                  background: "#f4f6fb",
                  borderRadius: 8,
                  padding: "1px 7px"
                }}>
                  {data.category.name}
                </span>
              )}
            </div>
          )}
          {/* Description */}
          <div style={{
            fontWeight: 500,
            color: "#253347",
            fontSize: 16,
            marginBottom: 0
          }}>
            Description
          </div>
          <div style={{
            color: "#777D8F",
            fontSize: 14,
            marginBottom: 18,
            marginTop: 2,
            minHeight: 22
          }}>
            {"description" in data && (data as any).description ? (
              <span
                style={{ display: "block" }}
                dangerouslySetInnerHTML={{ __html: (data as any).description }}
              />
            ) : (
              <span style={{ color: "#bbb" }}>No description provided.</span>
            )}
          </div>
          {/* Bulleted/Check info (parse out from description after first paragraph?) */}
          {(data as any).features?.length ? (
            <ul style={{
              margin: "0 0 0 15px",
              padding: 0,
              color: "#232f3e",
              fontSize: 14,
              lineHeight: "23px",
              listStyle: "disc"
            }}>
              {(data as any).features.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
          {/* You may wish to adjust how these bullet/check info is extracted; for now, skip */}
          {/* Terms & Conditions */}
          {(data as any).terms ||
          (Array.isArray((data as any).termsAndConditions) && (data as any).termsAndConditions.length > 0) ? (
            <div style={{
              marginTop: 24,
              background: "#fbfcfd",
              borderRadius: 12,
              border: "1px solid #f4f5f6",
              padding: "14px 16px 13px 16px"
            }}>
              <div style={{
                color: "#22346d",
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 6
              }}>
                Terms & Conditions
              </div>
              <ul style={{
                color: "#777D8F",
                fontSize: 14,
                margin: 0,
                paddingLeft: 17,
                lineHeight: "22px"
              }}>
                {(Array.isArray((data as any).termsAndConditions)
                  ? (data as any).termsAndConditions
                  : ((data as any).terms || "").split(/\n|\. /).filter((t: string) => t.trim())
                ).map((term: string, i: number) => (
                  <li key={i}>{term.trim()?.replace(/^\s*[-–•✓\u2713]+\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};
