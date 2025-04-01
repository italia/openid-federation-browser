import React from "react";
import { Button } from "./Button";
import { FormattedMessage } from "react-intl";
import style from "../css/ContextMenu.module.css";

export interface AccordinAtomProps {
  accordinId: string;
  labelId?: string;
  label?: string;
  hiddenElement: React.ReactNode;
  titleClassName?: string;
  show?: boolean;
}

export const AccordionAtom = ({
  accordinId,
  labelId,
  label,
  hiddenElement,
  titleClassName,
  show = false,
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
      <div className="accordion-header" id={accordinId}>
        <Button
          action={toggleCollapse}
          text={labelId ? <FormattedMessage id={labelId} /> : <>{label}</>}
          btnClassName={`accordion-button ${show ? "show" : "collapsed"}`}
          textClassName={titleClassName || style.contextAccordinTitle}
          id={`${accordinId}-button`}
          ariaLabel="Toggle Accordin"
        />
      </div>
      <div
        id={`${accordinId}-collapse`}
        className={`accordion-collapse ${show ? "show" : "collapse"}`}
        role="region"
        aria-labelledby={accordinId}
      >
        {hiddenElement}
      </div>
    </div>
  );
};
