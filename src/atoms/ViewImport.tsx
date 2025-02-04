import { useState, ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";
import { getTranslations } from "../lib/translations";
import { useNavigate } from "react-router-dom";
import style from "../css/ContextMenu.module.css";

export const ViewImportAtom = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<string | undefined>(undefined);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const text = await e.target.files[0].text();
      setFile(text);
    }
  };

  const uploadFile = () => {
    if (file) {
      sessionStorage.removeItem("currentSessionName");
      sessionStorage.setItem("currentSession", file);
      navigate("/graphView", { replace: true });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-10">
          <input
            type="file"
            className="form-control"
            id="input-value"
            placeholder={
              getTranslations(navigator.language)["view_upload_label"]
            }
            style={{ fontSize: "14px" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="col-2">
          <button
            className="btn btn-success btn-sm py-1 px-2"
            style={{ fontSize: "14px" }}
            onClick={() => uploadFile()}
            disabled={!file}
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
