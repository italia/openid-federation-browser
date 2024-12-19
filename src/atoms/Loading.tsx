import { FormattedMessage } from "react-intl";
import styles from "../css/BodyComponent.module.css";

export const LoadingAtom = () => {
  return (
    <div className={`container ${styles.bodyElement}`}>
      <div className="row">
        <h4>
          <FormattedMessage id="loading" />
        </h4>
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
