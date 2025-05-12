import React from "react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { handleCollapseVisibility, cleanInput } from "../lib/utils";
import { getTranslations } from "../lib/translations";
import { handleKeyDownEvent } from "../lib/utils";
import { isValidUrl } from "../lib/utils";
import style from "../css/ContextMenu.module.css";
import bodyStyle from "../css/BodyComponent.module.css";
import { useNavigate } from "react-router-dom";

export const UrlInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [doCheck, setDoCheck] = useState(false);
  const navigate = useNavigate();

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const searchType =
    window.location.pathname === "/insertEntityUrl" ? "entity" : "anchor";

  useEffect(() => {
    if (!doCheck) return;
    if (isValidUrl(inputValue)) {
      sessionStorage.setItem(
        "trustAnchorUrl",
        JSON.stringify({
          url: inputValue,
          searchType,
        }),
      );
      sessionStorage.removeItem("currentSession");
      sessionStorage.removeItem("currentSessionName");
      window.dispatchEvent(new Event("trustAnchorUrl"));
      navigate("/graphView", { replace: true });

      handleCollapseVisibility("invalid-input-collapse", false);
      cleanInput("input-value");
    } else {
      handleCollapseVisibility("invalid-input-collapse", true);
    }
    setDoCheck(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doCheck]);

  useEffect(() => handleKeyDownEvent("Enter", () => setDoCheck(true)), []);

  return (
    <div className={bodyStyle.bodyElement}>
      <div className="container">
        <div className="row">
          <div className="col-10">
            <input
              type="text"
              className={`form-control ${style.contextAccordinText}`}
              id="input-value"
              data-testid="input-value"
              onChange={changeValue}
              placeholder={
                getTranslations(navigator.language)[
                  searchType === "entity"
                    ? "insert_entity_url_label"
                    : "insert_anchor_url_label"
                ]
              }
            />
          </div>
          <div className="col-2">
            <button
              className="btn btn-primary btn-sm py-1 px-2"
              style={{ fontSize: "14px" }}
              onClick={() => setDoCheck(true)}
              data-testid="submit-button"
            >
              <span className={style.contextAccordinButton}>
                <FormattedMessage id="trust_anchor_url_button" />
              </span>
            </button>
          </div>
        </div>
        <div className="collapse row" id="invalid-input-collapse">
          <div className="col-10">
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
              style={{ fontSize: "14px" }}
            >
              <FormattedMessage id="invalid_url_error_message" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
