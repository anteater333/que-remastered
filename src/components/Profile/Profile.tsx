import styles from "./Profile.module.scss";
import img from "@/assets/dev/profile.png";

export const Profile = () => {
  return (
    <div className={styles.profile}>
      <img src={img} />
    </div>
  );
};
