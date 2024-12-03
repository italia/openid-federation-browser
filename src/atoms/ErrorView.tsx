import { FormattedMessage } from 'react-intl';
import { RoundedIconAtom } from './RoundedIcon';
import styles from '../css/BodyComponent.module.css';

export interface ErrorViewAtomProps {
    error: Error;
};

export const ErrorViewAtom = ({error}: ErrorViewAtomProps) => {
    return (
        <div className={`container ${styles.bodyElement}`}>
            <div className="row">
                <RoundedIconAtom iconID={"#it-warning-circle"} sizeClass='icon-xl' />
            </div>
            <div className='row'><h4><FormattedMessage id="error" /></h4></div>
            <div className='row'><h5><FormattedMessage id="message" />: {error.message}</h5></div>
            <div className="accordion">
                <div className="accordion-item">
                    <h2 className="accordion-header " id="error-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#detail-collapse" aria-expanded="true" aria-controls="detail-collapse">
                            <FormattedMessage id="error_details" />
                        </button>
                    </h2>
                    <div id="detail-collapse" className="accordion-collapse collapse" role="region" aria-labelledby="error-header">
                        <div className="accordion-body row" style={{height: "40vh"}}>
                            <textarea style={{overflowY: "scroll", resize: "none"}} value={JSON.stringify(error, undefined, 4)} readOnly></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};