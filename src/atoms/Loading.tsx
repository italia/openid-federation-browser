import React from "react";
import { FormattedMessage } from "react-intl";
import styles from "../css/BodyComponent.module.css";

export const LoadingAtom = () => {
  return (
    <div className={`container ${styles.bodyElement}`}>
      <div className="row">
        <span className="titillium-web-bold" style={{ fontSize: "28px" }}>
          <FormattedMessage id="loading" />
        </span>
      </div>
      <div
        className="row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="progress-spinner progress-spinner-active size-xl">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};
