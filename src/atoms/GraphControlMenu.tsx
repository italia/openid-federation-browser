import React from "react";
import { Link } from "react-router-dom";
import { IconAtom } from "./Icon";
import { FormattedMessage } from "react-intl";
import headerStyle from "../css/Header.module.css";

export interface GraphControlMenuAtomProps {
  showTCButton: boolean;
  onSessionSave: () => void;
  onExport: () => void;
  onTCCopy: () => void;
  onEntityAdd: () => void;
}

export const GraphControlMenuAtom = ({
  showTCButton,
  onSessionSave,
  onExport,
  onTCCopy,
  onEntityAdd,
}: GraphControlMenuAtomProps) => {
  return (
    <div
      style={{
        zIndex: 9,
        position: "absolute",
        top: 15,
        right: 15,
        padding: 1,
        color: "white",
      }}
    >
      <button
        className={`btn btn-primary btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
        style={{ display: "block", width: "100%" }}
        onClick={onEntityAdd}
      >
        <div className="row align-items-start">
          <div className="col-3">
            <IconAtom
              iconID="#it-plus"
              className="icon-sm icon-white"
              isRounded={false}
            />
          </div>
          <div className="col-md-auto">
            <span className="titillium-web-bold" style={{ fontSize: "14px" }}>
              <FormattedMessage id="add_entity" />
            </span>
          </div>
        </div>
      </button>
      <Link className="nav-link" to="/restoreSession">
        <button
          className={`btn btn-primary btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
          style={{ display: "block", width: "100%" }}
        >
          <div className="row">
            <div className="col-3">
              <IconAtom
                iconID="#it-upload"
                className="icon-sm icon-white"
                isRounded={false}
              />
            </div>
            <div className="col-md-auto">
              <span className="titillium-web-bold" style={{ fontSize: "14px" }}>
                <FormattedMessage id="upload_view" />
              </span>
            </div>
          </div>
        </button>
      </Link>
      <button
        className={`btn btn-primary btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
        style={{ display: "block", width: "100%" }}
        onClick={onExport}
      >
        <div className="row align-items-start">
          <div className="col-3">
            <IconAtom
              iconID="#it-download"
              className="icon-sm icon-white"
              isRounded={false}
            />
          </div>
          <div className="col-md-auto">
            <span className="titillium-web-bold" style={{ fontSize: "14px" }}>
              <FormattedMessage id="export" />
            </span>
          </div>
        </div>
      </button>
      <button
        className={`btn btn-primary btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
        style={{ display: "block", width: "100%" }}
        onClick={onSessionSave}
      >
        <div className="row">
          <div className="col-3">
            <IconAtom
              iconID="#it-bookmark"
              className="icon-sm icon-white"
              isRounded={false}
            />
          </div>
          <div className="col-md-auto">
            <span className="titillium-web-bold" style={{ fontSize: "14px" }}>
              <FormattedMessage id="save_view" />
            </span>
          </div>
        </div>
      </button>
      {showTCButton && (
        <button
          className={`btn btn-primary btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
          style={{ display: "block", width: "100%" }}
          onClick={onTCCopy}
        >
          <div className="row">
            <div className="col-3">
              <IconAtom
                iconID="#it-plug"
                className="icon-sm icon-white"
                isRounded={false}
              />
            </div>
            <div className="col-md-auto">
              <span className="titillium-web-bold" style={{ fontSize: "14px" }}>
                <FormattedMessage id="export_tc" />
              </span>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
