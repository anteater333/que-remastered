import styles from "./navigation.module.scss";
import SvgIcon from "@mui/material/SvgIcon";
import SearchIcon from "@mui/icons-material/Search";

export const GNB = () => {
  return (
    <div id="header" className={styles.gnb}>
      <SvgIcon component={SearchIcon} inheritViewBox />
    </div>
  );
};
