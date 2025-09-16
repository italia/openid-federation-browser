import React from "react";
import { FormattedMessage } from "react-intl";
import { useState, useRef } from "react";
import { handleCollapseVisibility } from "../lib/utils";
import { getTranslations } from "../lib/translations";
import { cleanInput, hideModalFromRef } from "../lib/utils";

export interface InputModalProps {
  modalID: string;
  headerID: string;
  placeorderID?: string;
  dismissActionID: string;
  acceptActionID?: string;
  onAccept: (value: string) => void;
  onDismiss?: () => void;
  inputVerifyFn?: (value: string) => boolean;
  invalidInputMessageID?: string;
}

export const InputModalAtom = ({
  modalID,
  headerID,
  placeorderID,
  dismissActionID,
  acceptActionID,
  onAccept,
  onDismiss,
  inputVerifyFn,
  invalidInputMessageID,
}: InputModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleCollapseVisibility(`${modalID}-invalid-input-collapse`, false);
  };

  const checkValue = () => {
    if (inputVerifyFn && inputVerifyFn(inputValue)) {
      handleCollapseVisibility(`${modalID}-invalid-input-collapse`, true);
      return;
    }
    onAccept(inputValue);
    cleanInput(`${modalID}-input-value`);
    handleCollapseVisibility(`${modalID}-invalid-input-collapse`, false);
    hideModalFromRef(inputRef);
  };

  return (
    <div className="modal" tabIndex={-1} role="dialog" id={modalID} ref={inputRef}>
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
                  id={`${modalID}-input-value`}
                  onChange={changeValue}
                  placeholder={
                    placeorderID
                      ? getTranslations(navigator.language)[`${placeorderID}`]
                      : ""
                  }
                  style={{ fontSize: "14px" }}
                />
              </div>
            </div>
            <div
              className="collapse row"
              id={`${modalID}-invalid-input-collapse`}
            >
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
                style={{ fontSize: "14px" }}
              >
                <FormattedMessage id={invalidInputMessageID || "invalid_input_value"} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-outline-primary btn-sm"
              type="button"
              data-bs-dismiss="modal"
              onClick={onDismiss}
              data-testid="modal-dismiss-button"
            >
              <FormattedMessage id={dismissActionID} />
            </button>
            {acceptActionID && (
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={checkValue}
                data-testid="modal-accept-button"
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
