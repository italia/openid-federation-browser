import sprite from "bootstrap-italia/dist/svg/sprites.svg";

interface IconProps {
  iconID: string;
  className?: string;
  isRounded?: boolean;
}

export const IconAtom = ({ iconID, className, isRounded }: IconProps) => {
  return (
    <span className={isRounded ? "rounded-icon" : ""}>
      <svg className={`icon ${className ? className.toString() : ""}`}>
        <use xlinkHref={sprite + iconID}></use>
      </svg>
    </span>
  );
};
