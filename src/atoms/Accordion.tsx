import React from "react";
import { FormattedMessage } from "react-intl";
import style from "../css/ContextMenu.module.css";

export interface AccordinAtomProps {
  accordinId: string;
  labelId?: string;
  label?: string;
  hiddenElement: JSX.Element;
  titleClassName?: string;
}

export const AccordionAtom = ({
  accordinId,
  labelId,
  label,
  hiddenElement,
  titleClassName,
}: AccordinAtomProps) => {
  const toggleCollapse = () => {
    const collapseButton = document.getElementById(
      `${accordinId}-button`,
    ) as HTMLElement;
    const collapseElement = document.getElementById(
      `${accordinId}-collapse`,
    ) as HTMLElement;
    if (collapseElement) {
      if (collapseElement.classList.contains("collapse")) {
        collapseElement.classList.remove("collapse");
        collapseElement.classList.add("show");
        collapseButton.classList.remove("collapsed");
      } else {
        collapseElement.classList.remove("show");
        collapseElement.classList.add("collapse");
        collapseButton.classList.add("collapsed");
      }
    }
  };

  return (
    <div className="accordion-item">
      <div className="accordion-header " id={accordinId}>
        <button
          id={`${accordinId}-button`}
          className="accordion-button collapsed"
          type="button"
          aria-expanded="true"
          aria-controls="detail-collapse"
          onClick={toggleCollapse}
        >
          <span className={titleClassName || style.contextAccordinTitle}>
            {labelId ? <FormattedMessage id={labelId} /> : <>{label}</>}
          </span>
        </button>
      </div>
      <div
        id={`${accordinId}-collapse`}
        className="accordion-collapse collapse"
        role="region"
        aria-labelledby={accordinId}
      >
        {hiddenElement}
      </div>
    </div>
  );
};
