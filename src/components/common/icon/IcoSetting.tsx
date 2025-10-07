import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/SettingsOutlined";
import IconActive from "@mui/icons-material/Settings";
import type { MaterialIconProps } from "./types";

export const IcoSetting = (props: MaterialIconProps) => {
  return (
    <SvgIcon
      component={props.isActive ? IconActive : Icon}
      inheritViewBox
      {...props}
    />
  );
};
