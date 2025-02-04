import { FormattedMessage } from "react-intl";
import { IconAtom } from "./Icon";
import style from "../css/Header.module.css";
import config from "../../package.json";
import { Link } from "react-router-dom";

export const SlimHeader = () => {
  return (
    <div className="it-header-slim-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="it-header-slim-wrapper-content">
              <div className="row">
                <div className="col-2">
                  <span className="d-lg-block navbar-brand">
                    <Link to="/">
                      <IconAtom
                        iconID={"#it-designers-italia"}
                        isRounded={true}
                        style={{ width: "32px", height: "32px" }}
                      />
                    </Link>
                  </span>
                </div>
                <div className="col-8">
                  <Link to="/">
                    <span className="d-lg-block navbar-brand mt-1">
                      <h1 className={style.pageTitle}>
                        <FormattedMessage id="title" />
                      </h1>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="it-header-slim-right-zone">
                <a
                  className="btn btn-primary btn-icon btn-full"
                  title="Fork on Github"
                  aria-label="Fork on Github"
                  href={import.meta.env.VITE_GITHUB_URL || "./"}
                >
                  <IconAtom
                    iconID={"#it-github"}
                    className="icon-primary"
                    isRounded={true}
                  />
                  <span className={`d-none d-lg-block ${style.headerText}`}>
                    <FormattedMessage id="fork_on_github" />
                  </span>
                </a>
                {config.version && (
                  <div
                    className={style.headerText}
                    style={{ marginLeft: "20px" }}
                  >
                    <FormattedMessage id="version" />
                    {config.version}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
