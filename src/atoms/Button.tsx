import React from "react";
import { IconAtom } from "./Icon";

export interface ButtonProps {
  action: () => void;
  text?: string;
  id?: string;
  title?: string;
  ariaLabel?: string;
  iconID?: string;
  btnClassName?: string;
  textClassName?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
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
  disabled,
  style,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={`btn btn-icon btn-xs py-1 px-1 ${btnClassName || ""}`}
      title={title}
      aria-label={ariaLabel}
      onClick={action}
      style={style}
      disabled={disabled || false}
    >
      {iconID && (
        <IconAtom
          iconID={iconID}
          className="icon-xs icon-white"
          isRounded={false}
        />
      )}
      {
        text && (
            <span className={textClassName}>{text}</span>
        )
      }
    </button>
  );
};
