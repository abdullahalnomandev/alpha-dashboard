import { DashboardOutlined } from "@ant-design/icons";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UserManagementPage from "../pages/user/UserManagementPage";
import { VscCalendar } from "react-icons/vsc";
import EventPage from "../pages/event";
import ClubPage from "../pages/club";
import { WiTime4 } from "react-icons/wi";
import MembershipApplicationPage from "../pages/membership-application";
import { SiReacthookform } from "react-icons/si";
import { HiOutlineUsers } from "react-icons/hi2";
import { FaRegNewspaper } from "react-icons/fa6";
import StoriesPage from "../pages/stories";
import { MdOutlineDomainAdd } from "react-icons/md";
import SponsorPage from "../pages/sponsor";


export const MENU_CONFIG = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      element:<DashboardPage />,
      path: '/',
    },
    {
      key: 'membership-application',
      label: 'Membership Application', 
      icon: <SiReacthookform />,
      element: <MembershipApplicationPage />,
      path: '/membership-application',
    },
    {
      key: 'user-management',
      label: 'User Management', 
      icon: <HiOutlineUsers />,
      element:<UserManagementPage />,
      path: '/users',
    },
    {
      key: 'event',
      label: 'Event',
      icon: <VscCalendar />,
      element:<EventPage />,
      path: '/event',
    },
    {
      key: 'club',
      label: 'Club',
      icon: <WiTime4  />,
      element:<ClubPage />,
      path: '/club',
    },
    {
      key: 'stories',
      label: 'Stories',
      icon: <FaRegNewspaper  />,
      element:<StoriesPage />,
      path: '/stories',
    },
    {
      key: 'sponsors',
      label: 'Sponsors',
      icon: <MdOutlineDomainAdd  />,
      element:<SponsorPage />,
      path: '/sponsors',
    },
  ]