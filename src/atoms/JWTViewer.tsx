import { useEffect, useState } from "react";
import { AccordionAtom } from "./Accordion";
import style from "../css/ContextMenu.module.css";

enum Tab {
  Raw,
  Decoded,
}

export interface ECViewerProps {
  id: string;
  raw: string;
  decodedPayload: { [key: string]: string };
  decodedHeader: { [key: string]: string };
}

export const JWTViewer = ({ id, raw, decodedPayload, decodedHeader }: ECViewerProps) => {
  const decodedPayloadStr = JSON.stringify(decodedPayload, null, 4);
  const decodedHeaderStr = JSON.stringify(decodedHeader, null, 4);
  const [tab, setTab] = useState(Tab.Decoded);

  const handleTabChange = (tab: Tab) => {
    const unselected = document.getElementById(
      tab === Tab.Raw ? `${id}-dec` : `${id}-raw`,
    ) as HTMLInputElement;
    unselected.checked = false;

    const selected = document.getElementById(
      tab === Tab.Raw ? `${id}-raw` : `${id}-dec`,
    ) as HTMLInputElement;
    selected.checked = true;

    setTab(tab);
  };

  useEffect(() => handleTabChange(Tab.Decoded), []);

  return (
    <div className="container" style={{ width: "100%", padding: "14px 24px" }}>
      <div className={`row ${style.contextAccordinText}`}>
        <div className="col-6">
          <div>
            <input
              name="Decoded"
              type="radio"
              id={`${id}-dec`}
              onClick={() => handleTabChange(Tab.Decoded)}
            />
            <label htmlFor={`${id}-dec`}>Decoded</label>
          </div>
        </div>
        <div className="col-6">
          <div>
            <input
              name="Raw"
              type="radio"
              id={`${id}-raw`}
              onClick={() => handleTabChange(Tab.Raw)}
            />
            <label htmlFor={`${id}-raw`}>Raw</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {tab === Tab.Raw ? (
            <textarea
              className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
              value={raw}
              readOnly
            ></textarea>
          ) : (
            <>
              <AccordionAtom accordinId="header" labelId="Header" hiddenElement={
                <textarea
                  className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
                  value={decodedHeaderStr}
                  style={{ height: "8rem" }}
                  readOnly
                ></textarea>
              } />
              <AccordionAtom accordinId="payload" labelId="Payload" hiddenElement={
                <textarea
                  className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
                  value={decodedPayloadStr}
                  readOnly
                ></textarea>
              } />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
