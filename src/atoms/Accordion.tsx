import { FormattedMessage } from "react-intl";
import style from "../css/ContextMenu.module.css";

export interface AccordinAtomProps {
  accordinId: string;
  labelId: string;
  hiddenElement: JSX.Element;
}

export const AccordionAtom = ({
  accordinId,
  labelId,
  hiddenElement,
}: AccordinAtomProps) => {
  return (
    <div className="accordion-item">
      <div className="accordion-header " id={accordinId}>
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${accordinId}-collapse`}
          aria-expanded="true"
          aria-controls="detail-collapse"
        >
          <span className={style.contextAccordinTitle}>
            <FormattedMessage id={labelId} />
          </span>
        </button>
      </div>
      <div
        id={`${accordinId}-collapse`}
        className="accordion-collapse collapse hidden"
        role="region"
        aria-labelledby={accordinId}
      >
        {hiddenElement}
      </div>
    </div>
  );
};
