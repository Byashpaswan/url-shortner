import { RouteInfo } from "./vertical-sidebar.metedata";

export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "mdi mdi-view-dashboard",
    class: "",
    extralink: false,
    permissions:[],
    permissionexcept:[],
    submenu: [],
  },
  {
    path: "/shorten-url",
    title: "Shorten URL",
    icon: "mdi mdi-link",
    class: "",
    extralink: false,
    permissions:[],
    permissionexcept:[],
    submenu: [],
  }
]