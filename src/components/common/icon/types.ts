import type {
  CommonProps,
  OverridableComponent,
} from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material/SvgIcon";

export type MaterialIconProps = Partial<
  CommonProps & OverridableComponent<SvgIconTypeMap<{}, "svg">>
> & {
  isActive?: boolean;
};
