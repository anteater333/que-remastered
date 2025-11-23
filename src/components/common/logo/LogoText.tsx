import logoMono from "@/assets/custom/logo-mono.svg";
import logoColor from "@/assets/custom/logo-colored.svg";

interface LogoBigProps {
  isColored: boolean;
}

export const LogoText = ({ isColored }: LogoBigProps) => {
  return <img src={isColored ? logoColor : logoMono} />;
};
