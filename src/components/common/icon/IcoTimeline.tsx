import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/HomeOutlined";
import IconActive from "@mui/icons-material/Home";
import type { MaterialIconProps } from "./types";

export const IcoTimeline = (props: MaterialIconProps) => {
  return (
    <SvgIcon
      component={props.isActive ? IconActive : Icon}
      inheritViewBox
      {...props}
    />
  );
};
