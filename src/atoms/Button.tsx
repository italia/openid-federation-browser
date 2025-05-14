import React from "react";
import { IconAtom } from "./Icon";

export interface ButtonProps {
  action: () => void;
  text?: string | React.ReactElement;
  id?: string;
  title?: string;
  ariaLabel?: string;
  iconID?: string;
  btnClassName?: string;
  textClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  test_id?: string;
}

export const Button = ({
  action,
  text,
  id,
  title,
  ariaLabel,
  iconID,
  btnClassName,
  textClassName,
  iconClassName,
  disabled,
  style,
  test_id,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={`btn ${btnClassName || "btn-icon btn-xs py-1 px-1"}`}
      title={title}
      aria-label={ariaLabel}
      onClick={action}
      style={style}
      disabled={disabled || false}
      data-testid={test_id}
    >
      {iconID && (
        <IconAtom
          iconID={iconID}
          className={iconClassName || "icon-xs icon-white"}
          isRounded={false}
        />
      )}
      {text && <span className={textClassName}>{text}</span>}
    </button>
  );
};
