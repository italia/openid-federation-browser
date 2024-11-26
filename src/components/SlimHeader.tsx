import sprite from "../assets/sprite.svg"; 
import { FormattedMessage } from "react-intl";

export function SlimHeader() {
    return (
        <div className="it-header-slim-wrapper">
            <div className="container">
            <div className="row">
                <div className="col-12">
                <div className="it-header-slim-wrapper-content">
                    <div className="row">
                        <div className="col-2">
                            <a className="d-lg-block navbar-brand" href="#"><svg className="icon"><use xlinkHref={sprite + "#it-designers-italia"}></use></svg></a>
                        </div>
                        <div className="col-10"><a className="d-lg-block navbar-brand"><FormattedMessage id="title" /></a></div>
                    </div>
                    <div className="it-header-slim-right-zone">
                    <a className="btn btn-primary btn-icon btn-full" href="#" title="Fork on Github" aria-label="Fork on Github">
                        <span className="rounded-icon">
                            <svg className="icon icon-primary">
                                <use xlinkHref={sprite + "#it-github"}></use>
                            </svg>
                        </span>
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