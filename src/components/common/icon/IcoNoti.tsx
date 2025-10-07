import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/NotificationsNone";
import IconActive from "@mui/icons-material/Notifications";

import type { MaterialIconProps } from "./types";

export const IcoNoti = (props: MaterialIconProps) => {
  return (
    <SvgIcon
      component={props.isActive ? IconActive : Icon}
      inheritViewBox
      {...props}
    />
  );
};
