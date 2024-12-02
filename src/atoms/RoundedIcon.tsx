import sprite from '../assets/sprite.svg';

interface RoundedIconProps {
    iconID: string;
    sizeClass?: string;
}

export const RoundedIconAtom = ({iconID, sizeClass}: RoundedIconProps) => {
    return (
        <span className="rounded-icon">
            <svg className={`icon icon-primary ${sizeClass}`}><use xlinkHref={sprite + iconID}></use></svg>
        </span>
    );
};