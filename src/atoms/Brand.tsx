import { FormattedMessage } from "react-intl";
import sprite from "../assets/sprite.svg";

export const BrandAtom = () => {
    return (
        <div className="it-brand-wrapper">
            <a href="/">
                <svg className="icon">
                    <use xlinkHref={sprite + "#it-code-circle"}></use>
                </svg>
                <div className="it-brand-text">
                    <h2 className="no_toc">
                        <FormattedMessage id="title" />
                    </h2>
                </div>
            </a>
        </div>
    );
};