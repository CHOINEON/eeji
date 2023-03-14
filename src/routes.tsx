import { Icon } from "@chakra-ui/react";
import { MdDashboard, MdDatasetLinked } from "react-icons/md";

// Admin Imports
import MainDashboard from "views/hmid";
import Login from "layouts/login/login";

// Auth Imports

const routes = [
  // {
  //   name: "home",
  //   layout: "/admin",
  //   path: "/login",
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: Login,
  // },
  {
    name: "HMID",
    layout: "/admin",
    path: "/hmid",
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "FoundationStructure",
    layout: "/admin",
    path: "/foundation-structure-analysis",
    icon: (
      <Icon as={MdDatasetLinked} width="20px" height="20px" color="inherit" />
    ),
    component: MainDashboard,
  },
];

export default routes;
