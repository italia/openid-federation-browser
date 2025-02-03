import { FormattedMessage } from "react-intl";
import { IconAtom } from "./Icon";
import style from "../css/Header.module.css";
import config from "../../package.json";

export const SlimHeader = () => {
  return (
    <div className="it-header-slim-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="it-header-slim-wrapper-content">
              <div className="row">
                <div className="col-2">
                  <a className="d-lg-block navbar-brand" href="./">
                    <IconAtom
                      iconID={"#it-designers-italia"}
                      isRounded={true}
                      style={{ width: "32px", height: "32px" }}
                    />
                  </a>
                </div>
                <div className="col-8">
                  <a href="./" className="d-lg-block navbar-brand mt-1">
                    <h1 className={style.pageTitle}>
                      <FormattedMessage id="title" />
                    </h1>
                  </a>
                </div>
              </div>
              <div className="it-header-slim-right-zone">
                <span
                  className="btn btn-primary btn-icon btn-full"
                  title="Fork on Github"
                  aria-label="Fork on Github"
                >
                  <IconAtom
                    iconID={"#it-github"}
                    className="icon-primary"
                    isRounded={true}
                  />
                  <span className={`d-none d-lg-block ${style.headerText}`}>
                    <FormattedMessage id="fork_on_github" />
                  </span>
                </span>
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
