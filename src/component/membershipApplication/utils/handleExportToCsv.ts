import { message } from "antd";
import dayjs from "dayjs";
import type { MembershipApplicationType } from "..";
import { api } from "../../../redux/api/baseApi";
import store from "../../../redux/store";
import "../../../redux/apiSlices/membershipApplicationSlice"; // ensure endpoints are injected for typing

// This function fetches ALL membership applications from the API and exports as CSV
export const handleExportToCsv = async () => {
  try {
    const queryParams = { page: 1, limit: 1000000 };

    const queryAction = store.dispatch(
      (api as any).endpoints.getMembershipApplications.initiate({
        query: queryParams,
      })
    );
    const result = await queryAction.unwrap();
    queryAction.unsubscribe();

    const tableData: MembershipApplicationType[] = result?.data || [];
    if (!tableData.length) {
      message.warning("No data to export.");
      return;
    }

    // Prepare header
    const headers = [
      "Membership ID",
      "Name",
      "Membership Type",
      "Email",
      "Phone",
      "Address",
      "Family Members",
      "Status",
      "Expires",
      "Created At",
    ];

    // Prepare CSV rows
    const rows = tableData.map((item) => {
      const familyString =
        item.familyMembers && item.familyMembers.length > 0
          ? item.familyMembers
              .map(
                (f) =>
                  `${f.name} (${f.relation})${f.email ? ` <${f.email}>` : ""}`
              )
              .join(" | ")
          : "";

      return [
        `"${item.memberShipId || ""}"`,
        `"${item.name || ""}"`,
        `"${(item.membershipType || "").replace(/_/g, " ")}"`,
        `"${item.email || ""}"`,
        `"${item.phone || ""}"`,
        `"${item.address || ""}"`,
        `"${familyString}"`,
        `"${
          item.membershipStatus
            ? item.membershipStatus.charAt(0).toUpperCase() +
              item.membershipStatus.slice(1)
            : ""
        }"`,
        `"${item.expireId ? dayjs(item.expireId).format("DD MMM YYYY, YYYY") : ""}"`,
        `"${
          item.createdAt
            ? dayjs(item.createdAt).format("DD MMM YYYY, YYYY")
            : ""
        }"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    // Trigger CSV download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const fileName = `membership_applications_${dayjs().format(
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
