import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/ThumbUpOffAlt";
import IconActive from "@mui/icons-material/ThumbUpAlt";

import type { MaterialIconProps } from "./types";

export const IcoThumb = (props: MaterialIconProps) => {
  return (
    <SvgIcon
      component={props.isActive ? IconActive : Icon}
      inheritViewBox
      {...props}
    />
  );
};
