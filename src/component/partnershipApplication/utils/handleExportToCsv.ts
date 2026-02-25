import { message } from "antd";
import dayjs from "dayjs";
import type { PartnerShipApplicationType } from "..";
import { useGetpartnerShipApplicationsQuery } from "../../../redux/apiSlices/partnershipApplicationSlice";

// This hook-based version can be used inside a component
export const exportPartnerShipCsv = (data: PartnerShipApplicationType[]) => {
  if (!data || !data.length) {
    message.warning("No data to export");
    return;
  }

  const headers = [
    "PartnerShip ID",
    "Company Name",
    "Contact Name",
    "Email",
    "Phone",
    "Website",
    "Message",
    "Status",
    "Created At",
    "Updated At",
  ];

  const rows = data.map((item) =>
    [
      `"${item.partnerShipId || ""}"`,
      `"${item.companyName || ""}"`,
      `"${item.contactName || ""}"`,
      `"${item.contactEmail || ""}"`,
      `"${item.contactPhone || ""}"`,
      `"${item.website || ""}"`,
      `"${item.message || ""}"`,
      `"${item.partnerShipStatus ? item.partnerShipStatus.charAt(0).toUpperCase() + item.partnerShipStatus.slice(1) : ""}"`,
      `"${item.createdAt ? dayjs(item.createdAt).format("DD MMM YYYY") : ""}"`,
      `"${item.updatedAt ? dayjs(item.updatedAt).format("DD MMM YYYY") : ""}"`,
    ].join(",")
  );

  const csvContent = [headers.join(","), ...rows].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const fileName = `PartnerShip_applications_${dayjs().format("YYYYMMDD_HHmmss")}.csv`;
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);

  message.success("Exported as CSV");
};