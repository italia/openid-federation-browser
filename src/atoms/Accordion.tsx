import { FormattedMessage } from 'react-intl';

export interface AccordinAtomProps {
    accordinId: string;
    labelId: string;
    hiddenElement: JSX.Element;
}

export const AccordionAtom = ({accordinId, labelId, hiddenElement}: AccordinAtomProps) => {
    return (
        <div className="accordion-item">
            <div className="accordion-header " id={accordinId}>
                <button 
                    className="accordion-button collapsed" 
                    style={{fontSize: "75%"}} 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target={`#${accordinId}-collapse`} 
                    aria-expanded="true" 
                    aria-controls="detail-collapse">
                    <FormattedMessage id={labelId} />
                </button>
            </div>
            <div 
                id={`${accordinId}-collapse`} 
                className="accordion-collapse collapse hidden" 
                role="region" 
                aria-labelledby={accordinId}>
                {hiddenElement}
            </div>
        </div>
    );
};