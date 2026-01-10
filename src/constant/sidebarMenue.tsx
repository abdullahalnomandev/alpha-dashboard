import { DashboardOutlined, UserOutlined } from "@ant-design/icons";
import DashboardPage from "../pages/dashboard/DashboardPage";
import UserManagementPage from "../pages/user/UserManagementPage";
import OrderPage from "../pages/order";
import { GrOrderedList } from "react-icons/gr";
import { CgGym } from "react-icons/cg";
import GymAndFitnessPage from "../pages/gymAndFitness";
import { IoAnalyticsSharp } from "react-icons/io5";
import BusinessAndMindSetPlanPage from "../pages/businessAndMindSet";
import { MdOutlineFoodBank } from "react-icons/md";
import MealPrepRecipesPage from "../pages/mealPrepRecipes";
import { VscCalendar } from "react-icons/vsc";
import EventPage from "../pages/event";
import ClubPage from "../pages/club";
import { WiTime4 } from "react-icons/wi";


export const MENU_CONFIG = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
      element:<DashboardPage />,
      path: '/',
    },
    {
      key: 'user-management',
      label: 'User Management', 
      icon: <UserOutlined />,
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
      key: 'order',
      label: 'Order Management',
      icon: <GrOrderedList />,
      element:<OrderPage />,
      path: '/order',
    },
    {
      key: 'gym&fitness',
      label: 'Gym & Fitness',
      icon: <CgGym  />,
      element:<GymAndFitnessPage />,
      path: '/gym_and_fitness',
    },
    {
      key: 'business_and_mindset_plan',
      label: 'Business & Mindset development Plan',
      icon: <IoAnalyticsSharp  />,
      element:<BusinessAndMindSetPlanPage />,
      path: '/business_and_mindset_plan',
    },
    {
      key: 'meal_prep_recipes',
      label: 'Meal Prep Recipes',
      icon: <MdOutlineFoodBank  />,
      element:<MealPrepRecipesPage />,
      path: '/meal_prep_recipes',
    },
  ]