import SvgIcon, { type SvgIconTypeMap } from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/NotificationsNone";
import type {
  CommonProps,
  OverridableComponent,
} from "@mui/material/OverridableComponent";

export const IcoNoti = (
  props: Partial<CommonProps & OverridableComponent<SvgIconTypeMap<{}, "svg">>>,
) => {
  return <SvgIcon component={Icon} inheritViewBox {...props} />;
};
