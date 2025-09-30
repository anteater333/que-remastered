import SvgIcon, { type SvgIconTypeMap } from "@mui/material/SvgIcon";
import Icon from "@mui/icons-material/SettingsOutlined";
import type {
  CommonProps,
  OverridableComponent,
} from "@mui/material/OverridableComponent";

export const IcoSetting = (
  props: Partial<CommonProps & OverridableComponent<SvgIconTypeMap<{}, "svg">>>,
) => {
  return <SvgIcon component={Icon} inheritViewBox {...props} />;
};
