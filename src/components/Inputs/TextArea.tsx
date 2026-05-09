import clsx from "clsx";
import styles from "./TextInput.module.scss";
import type { ComponentProps } from "react";

interface TextInputProps extends ComponentProps<"textarea"> {}

export const TextArea = ({ className, ...props }: TextInputProps) => {
  return <textarea className={clsx(styles.textInput, className)} {...props} />;
};
