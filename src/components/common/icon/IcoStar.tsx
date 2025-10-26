import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/StarBorder";
import IconActive from "@mui/icons-material/Star";

import type { MaterialIconProps } from "./types";

export const IcoStar = (props: MaterialIconProps) => {
  return (
    <SvgIcon
      component={props.isActive ? IconActive : Icon}
      inheritViewBox
      {...props}
    />
  );
};
