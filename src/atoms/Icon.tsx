import React from "react";
import sprite from "bootstrap-italia/dist/svg/sprites.svg";

interface IconProps {
  iconID: string;
  className?: string;
  isRounded?: boolean;
  style?: React.CSSProperties;
}

export const IconAtom = ({
  iconID,
  className,
  isRounded,
  style,
}: IconProps) => {
  const currentStyle = style ? style : {};

  return (
    <span className={isRounded ? "rounded-icon" : ""}>
      <svg
        className={`icon ${className ? className.toString() : ""}`}
        style={{ ...currentStyle }}
      >
        <use xlinkHref={sprite + iconID}></use>
      </svg>
    </span>
  );
};
