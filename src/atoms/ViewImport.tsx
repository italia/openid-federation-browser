import React from "react";
import { useState, ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { IconAtom } from "./Icon";

export const ViewImportAtom = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState<string | undefined>(undefined);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const text = await e.target.files[0].text();
      setFile(text);

      const fileName = e.target.files[0].name;
      setFileName(fileName);

      const fileSize = e.target.files[0].size;
      const fileSizeInKB = (fileSize / 1024).toFixed(2);
      setFileSize(fileSizeInKB);
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
          {
            fileName && 
            <ul className="upload-file-list">
              <li className="upload-file success">
                <IconAtom
                  iconID="#it-file"
                  className="icon-sm"
                  isRounded={false}
                />
                <p>
                  <span className="visually-hidden"><FormattedMessage id="loaded_file"/></span>
                  {fileName} 
                  <span className="upload-file-weight">{fileSize} KB</span>
                </p>
                <button disabled>
                  <IconAtom
                    iconID="#it-check"
                    className="icon-sm"
                    isRounded={false}
                  />
                </button>
              </li>
            </ul>
          }
          <input
            type="file"
            className="upload"
            id="input-value"
            onChange={handleFileChange}
          />
          <label htmlFor="input-value">
            <IconAtom
              iconID="#it-upload"
              className="icon-sm"
              isRounded={false}
            />
            <span>
              <FormattedMessage id="upload_file" />
            </span>
          </label>
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
      <div className="row">
        <div className="col-12" style={{ display: "flex", justifyContent: "flex-end"}}>
          <button
            className="btn btn-primary btn-sm py-2 px-4"
            style={{ fontSize: "14px" }}
            onClick={() => uploadFile()}
            disabled={!file}
          >
            <IconAtom
              iconID="#it-arrow-up-circle"
              className="icon-sm icon-white"
              isRounded={false}
            />
            <span className="titillium-web-bold">
              <FormattedMessage id="trust_anchor_url_button" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
