import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { handleCollapseVisibility } from "../lib/utils";

export interface AccordinAtomProps {
    accordinId: string;
    labelId: string;
    hiddenElement: JSX.Element;
}

export const AccordionAtom = ({accordinId, labelId, hiddenElement}: AccordinAtomProps) => {
    const [show, setShow] = useState(false);

    const accordinIdCollapse = () => {
        setShow(!show);
        handleCollapseVisibility(`${accordinId}-collapse`, show)
    };

    return (
        <div className="accordion-item">
            <h2 className="accordion-header " id={accordinId}>
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#${accordinId}-collapse`} aria-expanded="true" aria-controls="detail-collapse" onClick={accordinIdCollapse}>
                    <FormattedMessage id={labelId} />
                </button>
            </h2>
            <div id={`${accordinId}-collapse`} className="accordion-collapse collapse hidden" role="region" aria-labelledby={accordinId}>
                {hiddenElement}
            </div>
        </div>
    );
};