import { FormattedMessage } from 'react-intl';

export interface WarningModalProps {
    modalID: string;
    headerID: string;
    descriptionID?: string;
    description?: string;
    dismissActionID: string;
    acceptActionID?: string;
    onAccept?: () => void;
    onDismiss?: () => void;
};

export const WarningModalAtom = ({modalID, headerID, descriptionID, description, dismissActionID, acceptActionID, onAccept, onDismiss}: WarningModalProps) => {
    return (
        <div className="modal" tabIndex={-1} role="dialog" id={modalID}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 
                            className="modal-title h5" 
                            id="modal1Title">
                                <FormattedMessage id={headerID} />
                        </h2>
                    </div>
                    <div className="modal-body">
                        <p>{
                            description !== undefined
                                ? description 
                                : <FormattedMessage id={descriptionID} />
                        }</p>
                    </div>
                    <div className="modal-footer">
                        <button 
                            className="btn btn-outline-primary btn-sm" 
                            type="button" 
                            data-bs-dismiss="modal"
                            onClick={onDismiss}>
                                <FormattedMessage id={dismissActionID} />
                        </button>
                        {acceptActionID &&
                            <button 
                                className="btn btn-primary btn-sm" 
                                type="button" 
                                data-bs-dismiss="modal" 
                                onClick={onAccept}>
                                    <FormattedMessage id={acceptActionID} />
                            </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};