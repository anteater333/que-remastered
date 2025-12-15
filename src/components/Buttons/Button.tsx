import styles from "./Button.module.scss";
import clsx from "clsx";
import type { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {}

export const Button = ({
  className,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(styles.button, disabled && styles.disabled, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
