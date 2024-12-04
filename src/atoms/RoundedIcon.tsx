import sprite from '../assets/sprite.svg';

interface RoundedIconProps {
    iconID: string;
    sizeClass?: string;
    isPrimary?: boolean;
}

export const RoundedIconAtom = ({iconID, sizeClass, isPrimary}: RoundedIconProps) => {
    return (
        <span className="rounded-icon">
            <svg className={`icon ${isPrimary === true ? "icon-primary" : ""} ${sizeClass ? sizeClass.toString() : ""}`}><use xlinkHref={sprite + iconID}></use></svg>
        </span>
    );
};