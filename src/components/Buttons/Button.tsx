import styles from "./Button.module.scss";
import clsx from "clsx";
import type { ComponentProps } from "react";

type ButtonType = "primary" | "default" | "border";

interface ButtonProps extends ComponentProps<"button"> {
  buttonType?: ButtonType;
}

export const Button = ({
  className,
  children,
  disabled,
  buttonType = "default",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[buttonType],
        disabled && styles.disabled,
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
