import { message } from "antd";
import dayjs from "dayjs";
import { api } from "../../../redux/api/baseApi";
import store from "../../../redux/store";
import "../../../redux/apiSlices/membershipApplicationSlice";
import type { PartnerShipApplicationType } from "..";

export const handleExportPartnershipToCsv = async () => {
  try {
    const queryParams = { page: 1, limit: 1000000 };

    const queryAction = store.dispatch(
      (api as any).endpoints.getpartnerShipApplications.initiate({
        query: queryParams,
      })
    );

    const result = await queryAction.unwrap();
    queryAction.unsubscribe();

    const tableData: PartnerShipApplicationType[] = result?.data || [];

    if (!tableData.length) {
      message.warning("No data to export.");
      return;
    }

    // ✅ Correct Headers for Partnership
    const headers = [
      "Partnership ID",
      "Company Name",
      "Industry",
      "Contact Name",
      "Contact Email",
      "Contact Phone",
      "Website",
      "Status",
      "Message",
      "Created At",
    ];

    const rows = tableData.map((item) => {
      return [
        `"${item.partnerShipId || ""}"`,
        `"${item.companyName || ""}"`,
        `"${item.industry || ""}"`,
        `"${item.contactName || ""}"`,
        `"${item.contactEmail || ""}"`,
        `"${item.contactPhone || ""}"`,
        `"${item.website || ""}"`,
        `"${
          item.partnerShipStatus
            ? item.partnerShipStatus.charAt(0).toUpperCase() +
              item.partnerShipStatus.slice(1)
            : ""
        }"`,
        `"${item.message || ""}"`,
        `"${
          item.createdAt
            ? dayjs(item.createdAt).format("DD MMM YYYY, HH:mm")
            : ""
        }"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const fileName = `partnership_applications_${dayjs().format(
      "YYYYMMDD_HHmmss"
    )}.csv`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 500);

    message.success("Exported as CSV");
  } catch (error) {
    message.error("Failed to export CSV");
  }
};