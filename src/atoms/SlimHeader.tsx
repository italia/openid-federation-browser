import { FormattedMessage } from "react-intl";
import { RoundedIconAtom } from "./RoundedIcon";

export const SlimHeader = () => {
    return (
        <div className="it-header-slim-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="it-header-slim-wrapper-content">
                            <div className="row">
                                <div className="col-2">
                                    <a className="d-lg-block navbar-brand" href="#"><RoundedIconAtom iconID={"#it-designers-italia"} /></a>
                                </div>
                                <div className="col-10"><a className="d-lg-block navbar-brand"><FormattedMessage id="title" /></a></div>
                            </div>
                            <div className="it-header-slim-right-zone">
                                <a className="btn btn-primary btn-icon btn-full" href="#" title="Fork on Github" aria-label="Fork on Github">
                                    <RoundedIconAtom iconID={"#it-github"} isPrimary={true} />
                                    <span className="d-none d-lg-block"><FormattedMessage id="fork_on_github" /></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }