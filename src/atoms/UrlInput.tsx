import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { handleCollapseVisibility, cleanInput } from "../lib/utils";
import { getTranslations } from "../lib/translations";
import { handleKeyDownEvent } from "../lib/utils";
import { isValidUrl } from "../lib/utils";
import style from "../css/ContextMenu.module.css";

export const UrlInputAtom = () => {
  const [inputValue, setInputValue] = useState("");
  const [doCheck, setDoCheck] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const changeValue = (e: any) => setInputValue(e.target.value);

  useEffect(() => {
    if (!doCheck) return;
    if (isValidUrl(inputValue)) {
      sessionStorage.setItem(
        "trustAnchorUrl",
        JSON.stringify({
          url: inputValue,
          searchType: searchParams.has("insertEntityUrl") ? "entity" : "anchor",
        }),
      );
      sessionStorage.removeItem("currentSession");
      sessionStorage.removeItem("currentSessionName");
      window.dispatchEvent(new Event("trustAnchorUrl"));
      setSearchParams({ graphView: "" });

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
    <div className="container">
      <div className="row">
        <div className="col-10">
          <input
            type="text"
            className={`form-control ${style.contextAccordinText}`}
            id="input-value"
            onChange={changeValue}
            placeholder={
              getTranslations(navigator.language)[
                searchParams.has("insertEntityUrl")
                  ? "insert_entity_url_label"
                  : "insert_anchor_url_label"
              ]
            }
          />
        </div>
        <div className="col-2">
          <button
            className="btn btn-success btn-sm py-1 px-2"
            style={{ fontSize: "14px" }}
            onClick={() => setDoCheck(true)}
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
  );
};
