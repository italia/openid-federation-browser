import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import style from "../css/Header.module.css";

export const NavBarAtom = () => {
  return (
    <div className="it-header-navbar-wrapper">
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <nav
              className="navbar navbar-expand-lg has-megamenu"
              aria-label="Navigazione principale"
            >
              <div
                className="navbar-collapsable"
                id="nav1"
                style={{ display: "none" }}
              >
                <div className="menu-wrapper">
                  <ul className="navbar-nav">
                    <li className="nav-item active">
                      <Link className="nav-link" to="/?insertUrl">
                        <span className={style.headerText}>
                          <FormattedMessage id="insert_trust_node_url_option" />
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/?listUrl">
                        <span className={style.headerText}>
                          <FormattedMessage id="select_trust_node_url_option" />
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/?insertEntityUrl">
                        <span className={style.headerText}>
                          <FormattedMessage id="insert_entity_node_url_option" />
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/?viewUpload">
                        <span className={style.headerText}>
                          <FormattedMessage id="upload_entity_view_option" />
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
