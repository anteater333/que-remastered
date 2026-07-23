import Icon from "@mui/icons-material/PersonAddOutlined";
import SvgIcon from "@mui/material/SvgIcon";
import IconActive from "@mui/icons-material/Notifications";

import type { MaterialIconProps } from "./types";

export const IcoPersonAdd = (props: MaterialIconProps) => {
  return (
    <SvgIcon
      component={props.isActive ? IconActive : Icon}
      inheritViewBox
      {...props}
    />
  );
};
