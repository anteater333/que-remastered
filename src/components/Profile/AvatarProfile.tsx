import Avatar from "boring-avatars";

type AvatarProfileProps = {
  name: string;
};

export const AvatarProfile = ({ name }: AvatarProfileProps) => {
  return <Avatar name={name} size={"100%"} variant="beam" />;
};
