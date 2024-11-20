import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import sprite from "../assets/sprite.svg";

interface GithubForkProps {
    githubPageUrl: string;
}

export const GithubForkAtom = ({githubPageUrl}: GithubForkProps) => {
    return (
        <div className="it-socials d-none d-md-flex">
            <FormattedMessage id="fork_on_github" />
            <Link to={githubPageUrl}><svg className="icon"><use xlinkHref={sprite + "#it-github"}></use></svg></Link>
        </div>
    )
};