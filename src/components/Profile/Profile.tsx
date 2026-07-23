import clsx from "clsx";
import type { ComponentProps } from "react";
import { AvatarProfile } from "./AvatarProfile";
import styles from "./Profile.module.scss";

interface ProfileProps extends ComponentProps<"div"> {
  profilePictureUrl?: string;
  userHandle?: string;
}

export const Profile = ({
  className,
  profilePictureUrl,
  userHandle,
  ...rest
}: ProfileProps) => {
  return (
    <div className={clsx(styles.profile, className)} {...rest}>
      {profilePictureUrl ? (
        <img src={profilePictureUrl} />
      ) : (
        <AvatarProfile name={userHandle ?? ""} />
      )}
    </div>
  );
};
