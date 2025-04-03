import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const NavBarAtom = () => {
  const location = useLocation();
  const [hasGraphInitialized, setHasGraphInitialized] = useState(false);

  useEffect(() => {
    if (location.pathname === "/graphView") {
      setHasGraphInitialized(true);
    }
  }, [location.pathname]);

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
                  <ul
                    className="navbar-nav titillium-web-bold"
                    style={{ fontSize: "18px !important" }}
                  >
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/insertUrl" ? "active" : ""}`}
                        to="/insertUrl"
                      >
                        <span style={{ padding: "2px 24px" }}>
                          <FormattedMessage id="insert_trust_node_url_option" />
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/listUrl" ? "active" : ""}`}
                        to="/listUrl"
                      >
                        <FormattedMessage id="select_trust_node_url_option" />
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/insertEntityUrl" ? "active" : ""}`}
                        to="/insertEntityUrl"
                      >
                        <FormattedMessage id="insert_entity_node_url_option" />
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/restoreSession" ? "active" : ""}`}
                        to="/restoreSession"
                      >
                        <FormattedMessage id="restore_session_label" />
                      </Link>
                    </li>
                    {hasGraphInitialized && (
                      <li className="nav-item">
                        <Link
                          className={`nav-link ${location.pathname === "/graphView" ? "active" : ""}`}
                          to="/graphView"
                        >
                          <FormattedMessage id="current_view_label" />
                        </Link>
                      </li>
                    )}
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
