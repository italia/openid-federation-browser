import { FormattedMessage } from "react-intl";
import { IconAtom } from "./Icon";
import style from "../css/Header.module.css";

export const SlimHeader = () => {
    return (
        <div className="it-header-slim-wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="it-header-slim-wrapper-content">
                            <div className="row">
                                <div className="col-2">
                                    <a className="d-lg-block navbar-brand" href="#">
                                        <IconAtom iconID={"#it-designers-italia"} isRounded={true} />
                                    </a>
                                </div>
                                <div className="col-10">
                                    <a className="d-lg-block navbar-brand">
                                        <h1 className={style.pageTitle}>
                                            <FormattedMessage id="title" />
                                        </h1>
                                    </a>
                                </div>
                            </div>
                            <div className="it-header-slim-right-zone">
                                <a 
                                    className="btn btn-primary btn-icon btn-full" 
                                    href="#" 
                                    title="Fork on Github" 
                                    aria-label="Fork on Github"
                                >
                                    <IconAtom 
                                        iconID={"#it-github"} 
                                        className="icon-primary" 
                                        isRounded={true}
                                    />
                                    <span className={`d-none d-lg-block ${style.headerText}`} >
                                        <FormattedMessage id="fork_on_github" />
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }