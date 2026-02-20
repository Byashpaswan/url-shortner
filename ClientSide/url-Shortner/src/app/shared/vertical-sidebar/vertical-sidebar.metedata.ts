export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  extralink: boolean;
  permissions:Array<string>;
  permissionexcept:Array<string>;
  submenu: RouteInfo[];
}