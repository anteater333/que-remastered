import { AvatarProfile } from "./AvatarProfile";
import styles from "./Profile.module.scss";

type ProfileProps = {
  profilePictureUrl?: string;
  userHandle?: string;
};

export const Profile = ({ profilePictureUrl, userHandle }: ProfileProps) => {
  return (
    <div className={styles.profile}>
      {profilePictureUrl ? (
        <img src={profilePictureUrl} />
      ) : (
        <AvatarProfile name={userHandle ?? ""} />
      )}
    </div>
  );
};
