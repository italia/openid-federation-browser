import React from "react";
import { IconAtom } from "./Icon";

export interface ButtonProps {
  action: () => void;
  text: string;
  title?: string;
  ariaLabel?: string;
  iconID?: string;
  btnClassName?: string;
  textClassName?: string;
  style?: React.CSSProperties;
}

export const Button = ({
  action,
  text,
  title,
  ariaLabel,
  iconID,
  btnClassName,
  textClassName,
  style,
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-icon btn-xs py-1 px-1 ${btnClassName || ""}`}
      title={title}
      aria-label={ariaLabel}
      onClick={action}
      style={style}
    >
      {iconID && (
        <IconAtom
          iconID={iconID}
          className="icon-xs icon-white"
          isRounded={false}
        />
      )}
      <span className={textClassName}>{text}</span>
    </button>
  );
};
