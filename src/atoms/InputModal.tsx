import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { handleCollapseVisibility } from "../lib/utils";
import { getTranslations } from "../lib/translations";

export interface InputModalProps {
  modalID: string;
  headerID: string;
  placeorderID?: string;
  dismissActionID: string;
  acceptActionID?: string;
  onAccept: (value: string) => void;
  onDismiss?: () => void;
}

export const InputModalAtom = ({
  modalID,
  headerID,
  placeorderID,
  dismissActionID,
  acceptActionID,
  onAccept,
  onDismiss,
}: InputModalProps) => {
  const [inputValue, setInputValue] = useState("");

  const changeValue = (e: any) => setInputValue(e.target.value);
  const checkValue = () => {
    if (inputValue === "") {
      handleCollapseVisibility("invalid-input-collapse", true);
      return;
    }
    onAccept(inputValue);
    handleCollapseVisibility("invalid-input-collapse", false);
  };

  return (
    <div className="modal" tabIndex={-1} role="dialog" id={modalID}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <p
              className="modal-title"
              style={{ fontSize: "18px" }}
              id="modal1Title"
            >
              <FormattedMessage id={headerID} />
            </p>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                <input
                  type="text"
                  className="form-control"
                  id="input-value"
                  onChange={changeValue}
                  placeholder={
                    placeorderID
                      ? getTranslations(navigator.language)[placeorderID]
                      : ""
                  }
                  style={{ fontSize: "14px" }}
                />
              </div>
            </div>
            <div className="collapse row" id="invalid-input-collapse">
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
                style={{ fontSize: "14px" }}
              >
                <FormattedMessage id="invalid_url_error_message" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-outline-primary btn-sm"
              type="button"
              data-bs-dismiss="modal"
              onClick={onDismiss}
            >
              <FormattedMessage id={dismissActionID} />
            </button>
            {acceptActionID && (
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={checkValue}
                data-bs-dismiss="modal"
              >
                <FormattedMessage id={acceptActionID} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
