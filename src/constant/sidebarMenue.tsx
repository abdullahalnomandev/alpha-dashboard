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
import OfferCategoryPage from "../pages/OfferCategoryPage";
import { CiBoxList, CiCircleInfo, CiSettings } from "react-icons/ci";
import { BiSolidOffer } from "react-icons/bi";
import ExclusiveOfferPage from "../pages/ExclusiveOfferPage";
import AboutPage from "../pages/settings/AboutPage";

// Adjust for Ant Design Menu's "children" as subMenu, `element` and `path` should be only on leaf items

export const MENU_CONFIG = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
    element: <DashboardPage />,
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
    element: <UserManagementPage />,
    path: '/users',
  },
  {
    key: 'event',
    label: 'Event',
    icon: <VscCalendar />,
    element: <EventPage />,
    path: '/event',
  },
  {
    key: 'club',
    label: 'Club',
    icon: <WiTime4 />,
    element: <ClubPage />,
    path: '/club',
  },
  {
    key: 'stories',
    label: 'Stories',
    icon: <FaRegNewspaper />,
    element: <StoriesPage />,
    path: '/stories',
  },
  {
    key: 'sponsors',
    label: 'Sponsors',
    icon: <MdOutlineDomainAdd />,
    element: <SponsorPage />,
    path: '/sponsors',
  },
  {
    key: 'offer-category',
    label: 'Offer Categories',
    icon: <CiBoxList />,
    element: <OfferCategoryPage />,
    path: '/offer-categories',
  },
  {
    key: 'offer',
    label: 'Exclusive Offer',
    icon: <BiSolidOffer />,
    element: <ExclusiveOfferPage />,
    path: '/offer',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <CiSettings />,
    children: [
      {
        key: 'settings-sponsors',           // make the key unique among all menu items
        label: 'Sponsors',
        icon: <MdOutlineDomainAdd />,
        element: <SponsorPage />,
        path: '/sponsors',
      },
      {
        key: 'settings-about',     // make the key unique among all menu items
        label: 'About',
        icon: <CiCircleInfo />,
        element: <AboutPage />,
        path: '/settings/about',
      },
    ]
  }
]