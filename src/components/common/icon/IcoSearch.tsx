import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/Search";
import type { MaterialIconProps } from "./types";

export const IcoSearch = (props: MaterialIconProps) => {
  return <SvgIcon component={Icon} inheritViewBox {...props} />;
};
