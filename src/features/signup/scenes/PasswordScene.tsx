import type { SignUpSceneProps } from "../types";

const PasswordScene = ({
  onValidated,
  email,
}: SignUpSceneProps<{}> & { email: string }) => {
  return <>Hello {email}</>;
};

export default PasswordScene;
