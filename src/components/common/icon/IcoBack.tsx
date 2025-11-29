import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/ArrowBack";

import type { MaterialIconProps } from "./types";

export const IcoBack = (props: MaterialIconProps) => {
  return <SvgIcon component={Icon} inheritViewBox {...props} />;
};
