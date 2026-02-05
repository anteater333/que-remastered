import clsx from "clsx";
import styles from "./TextInput.module.scss";
import type { ComponentProps } from "react";

interface TextInputProps extends ComponentProps<"input"> {}

export const TextInput = ({ className, ...props }: TextInputProps) => {
  return <input className={clsx(styles.textInput, className)} {...props} />;
};
