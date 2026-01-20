import { Card, Col, Row, Typography, Space, Select } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { BiTimeFive } from "react-icons/bi";
import { VscCalendar } from "react-icons/vsc";
import { PiUsersThree } from "react-icons/pi";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetUsersQuery, useGetUserStatisticsQuery } from "../../redux/apiSlices/userSlice";
import { useGetEventsQuery } from "../../redux/apiSlices/eventSlice";

const { Text } = Typography;

/* Month mappings */
const monthMap: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

const monthOrder = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const monthNumToAbbr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function DashboardPage() {
  const [selectedUserYear, setSelectedUserYear] = useState(
    new Date().getFullYear()
  );

  const [userPage] = useState(1);
  const [userLimit] = useState(10);

  let query = {
    page: userPage,
    limit: userLimit,
  };

  const { data } = useGetUserStatisticsQuery({ year: String(selectedUserYear) });
  const { data: userData } = useGetUsersQuery({ query });
  const { data: userEvent } = useGetEventsQuery({ query });

  const users = userData?.data?.data;
  const events = userEvent?.data;


  // const paginationInfo = {
  //   total: userData?.data?.data?.total,
  //   limit: userData?.data?.data?.limit,
  //   page: userData?.data?.data?.page,
  //   totalPage: userData?.data?.data?.totalPage,
  // };
  console.log(users);

  /* User statistics (monthly users) */
  const userStatistics = data?.data?.userStatistics || data?.userStatistics;

  const chartData =
    userStatistics &&
    monthOrder.map((key, idx) => ({
      month: `${selectedUserYear}-${String(idx + 1).padStart(2, "0")}`,
      users: userStatistics[key] ?? 0,
    }));

  console.log(userStatistics);

  /* Top cards */
  const cardData = [
    {
      icon: <PiUsersThree />,
      path:'/users',
      label: "Total Members",
      value: data?.data?.totalUser ?? data?.totalUser ?? 0,
      iconBg: "#e5e7eb",
    },
    {
      icon: <DollarOutlined />,
      label: "Active Offers",
      value: data?.data?.totalExclusiveOffer ?? data?.totalExclusiveOffer ?? 0,
      iconBg: "#F0E4C4",
      path:'/offer',
      iconColor: "#C9961B",
    },
    {
      icon: <VscCalendar />,
      label: "Upcoming Events",
      path:'/event',
      value: data?.data?.totalEvent ?? data?.totalEvent ?? 0,
      iconBg: "#00A63E1A",
      iconColor: "#00A63E",
    },
    {
      icon: <BiTimeFive />,
      label: "Total Clubs",
      value: data?.data?.totalClubs ?? data?.totalClubs ?? 0,
      iconBg: "#9810FA1A",
      path:'/club',
      iconColor: "#9810FA",
    },
  ];

  return (
    <Space direction="vertical" size={28} style={{ width: "100%" }}>
      {/* Top statistic cards */}
      <Row gutter={[20, 20]}>
        {cardData.map((item) => {
          const CardContent = (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "28px 24px",
                border: "1.5px solid #f3f3f7",
                boxShadow: "0 1.5px 5px rgba(0,0,0,0.03)",
                minHeight: 148,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: item.path ? 'pointer' : 'default',
                transition: item.path ? 'box-shadow 0.18s' : undefined,
              }}
              className={item.path ? "dashboard-card-link" : ""}
            >
              <div>
                <Text
                  style={{
                    color: "#9698a7",
                    fontSize: 22,
                    fontWeight: 400,
                    marginBottom: 10,
                    display: "block",
                  }}
                >
                  {item.label}
                </Text>
                <span
                  style={{
                    color: "#0b1033",
                    fontSize: 36,
                    fontWeight: 600,
                  }}
                >
                  {item.value.toLocaleString()}
                </span>
              </div>

              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 9,
                  background: item.iconBg,
                  color: item.iconColor,
                  fontSize: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </div>
            </div>
          );
          return (
            <Col key={item.label} xs={24} sm={12} md={8} xl={6}>
              {item.path ? (
                <a
                  href={item.path}
                  style={{ textDecoration: "none" }}
                  tabIndex={0}
                  aria-label={item.label}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', item.path);
                    const navEvent = new PopStateEvent('popstate');
                    window.dispatchEvent(navEvent);
                  }}
                >
                  {CardContent}
                </a>
              ) : (
                CardContent
              )}
            </Col>
          );
        })}
      </Row>

      {/* User statistics chart */}
      <Card
        style={{
          background: "#fff",
          borderRadius: 8,
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px #f5f5f5",
        }}
        styles={{ body: { padding: 24 } }}
        title={
          <Text style={{ fontSize: 18, fontWeight: 600 }}>
            User Statistics
          </Text>
        }
        extra={(() => {
          const currentYear = new Date().getFullYear();
          const years = Array.from({ length: 4 }, (_, i) => currentYear - i);
          return (
            <Select
              size="small"
              value={String(selectedUserYear)}
              onChange={(value) => setSelectedUserYear(Number(value))}
              options={years.map((year) => ({
                value: String(year),
                label: String(year),
              }))}
            />
          );
        })()}
      >
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9961B" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#F0E4C4" stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                const monthNum = Number(String(value).split("-")[1]);
                return monthNumToAbbr[monthNum - 1];
              }}
              tick={{ fill: "#555", fontSize: 13 }}
            />
            <YAxis tick={{ fill: "#555", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "rgba(22,119,255,0.07)" }}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const row = payload[0].payload;
                  const monthNum = Number(row.month.split("-")[1]);
                  const abbr = monthNumToAbbr[monthNum - 1];
                  return (
                    <div
                      style={{
                        background: "#fff",
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "#C9961B",
                        }}
                      >
                        {monthMap[abbr]}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#888",
                          marginTop: 6,
                        }}
                      >
                        Total Users
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#222",
                        }}
                      >
                        {row.users.toLocaleString()}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#C9961B"
              strokeWidth={2}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Row
        gutter={[20, 20]}
        style={{ marginTop: 8, width: "100%" }}
      >
        {/* Recent Member Registrations */}
        <Col xs={24} md={14} lg={16}>
          <Card
            title={
              <Text style={{ fontSize: 16, fontWeight: 600 }}>
                Recent Member Registrations
              </Text>
            }
            style={{
              borderRadius: 14,
              minHeight: 360,
              maxHeight: 380,
              overflow: "hidden",
            }}
            bodyStyle={{
              padding: 0,
              height: 320,
              overflowY: "auto",
            }}
          >
            <div>
              {users?.map((user: any, i: number) => (
                <div
                  key={user.name + i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f1f1f1",
                    padding: "20px 24px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <Text style={{ fontSize: 16, fontWeight: 600 }}>
                      {user.name}
                    </Text>
                    <div
                      style={{
                        color: "#888",
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {user.email}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      alignItems: "flex-end",
                      justifyContent: "center",
                      textAlign: "right",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color:
                          user?.application_form?.membershipType === "alpha_family"
                            ? "#9935ff"
                            : "#00A63E",
                        background:
                          user.type === "alpha"
                            ? "#f7f1ff"
                            : "#eafbf0",
                        padding: "2px 12px",
                        borderRadius: 8,
                        fontWeight: 600,
                        marginRight: 0,
                        textTransform: "capitalize",
                        display: "inline-block",
                      }}
                    >
                      {user?.application_form?.membershipType
                        ? user.application_form.membershipType
                            .split("_")
                            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")
                        : ""}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#aaa",
                        fontWeight: 600,
                        minWidth: 85,
                        textAlign: "right",
                        display: "block",
                      }}
                    >
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        {/* Activity Events */}
        <Col xs={24} md={10} lg={8}>
          <Card
            title={
              <Text style={{ fontSize: 16, fontWeight: 600 }}>
                Activity Events
              </Text>
            }
            style={{
              borderRadius: 14,
              minHeight: 360,
              maxHeight: 380,
              overflow: "hidden",
            }}
            bodyStyle={{
              padding: 0,
              height: 320,
              overflowY: "auto",
            }}
          >
            <div>
              {events?.length > 0 ? (
                events.map((event: any, idx: number) => {
                  // Format date: 20 Jan, 2025
                  let formattedDate = "";
                  if (event.createdAt) {
                    const dateObj = new Date(event.createdAt);
                    const day = dateObj.getDate();
                    const month = dateObj.toLocaleString(undefined, { month: "short" }); // Jan, Feb, etc.
                    const year = dateObj.getFullYear();
                    formattedDate = `${day} ${month}, ${year}`;
                  }

                  return (
                    <div
                      key={event._id || event.title + idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom:
                          idx === events.length - 1 ? "none" : "1px solid #f1f1f1",
                        padding: "18px 24px",
                        background: "#fff",
                      }}
                    >
                      <span
                        role="img"
                        aria-label="event"
                        style={{ fontSize: 18, marginRight: 9 }}
                      >
                        &#128197;
                      </span>
                      <span style={{ fontSize: 15, color: "#444", flex: 1 }}>
                        {event?.name}
                      </span>
                      {formattedDate && (
                        <span style={{ color: "#888", fontSize: 13, minWidth: 90, textAlign: "right" }}>
                          {formattedDate}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "18px 24px", color: "#888", fontSize: 15 }}>
                  No activity events to show.
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

export default DashboardPage;
