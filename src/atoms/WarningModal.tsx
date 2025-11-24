import React from "react";
import { FormattedMessage } from "react-intl";
import style from "../css/ContextMenu.module.css";

export interface WarningModalProps {
  modalID: string;
  headerID: string;
  descriptionID?: string;
  description?: string;
  dismissActionID: string;
  acceptActionID?: string;
  details?: string[];
  onAccept?: () => void;
  onDismiss?: () => void;
}

export const WarningModalAtom = ({
  modalID,
  headerID,
  descriptionID,
  description,
  dismissActionID,
  acceptActionID,
  details,
  onAccept,
  onDismiss,
}: WarningModalProps) => {
  return (
    <div
      className="modal"
      tabIndex={-1}
      role="dialog"
      id={modalID}
      data-testid="warning-modal"
    >
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
            <p>
              {description !== undefined ? (
                <span className={style.contextAccordinTitle}>
                  {description}
                </span>
              ) : (
                <FormattedMessage id={descriptionID} />
              )}
            </p>
            {details && 
              <ul>
                {details.slice(0, 5).map((detail, index) => {
                  const [entity, message] = detail.split(" - ");
                  return (
                    <li key={index} className={style.contextAccordinText}>
                      <p className="p-warning">{entity}</p>
                      <p className="p-warning">{message}</p>
                    </li>
                  );
                })}
                {details.length > 5 && (
                  <li>
                    <p className="p-warning">others ...</p>
                  </li>
                )}
              </ul>
            }
          </div>
          <div className="modal-footer">
            <button
              data-testid="warning-modal-dismiss-button"
              className="btn btn-outline-primary btn-sm"
              type="button"
              data-bs-dismiss="modal"
              onClick={onDismiss}
            >
              <FormattedMessage id={dismissActionID} />
            </button>
            {acceptActionID && (
              <button
                data-testid="warning-modal-accept-button"
                className="btn btn-primary btn-sm"
                type="button"
                data-bs-dismiss="modal"
                onClick={onAccept}
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
