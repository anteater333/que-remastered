import styles from "./Splash.module.scss";
/**
 * 스플래시 화면에 대한 시각적 컴포넌트
 */
const Splash = () => {
  return (
    <div className={styles["splash-container"]}>
      <span className={styles["splash-title"]}>QUE</span>
    </div>
  );
};

export default Splash;
