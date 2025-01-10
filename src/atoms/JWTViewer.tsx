import { useEffect, useState } from "react";
import style from "../css/ContextMenu.module.css";

enum Tab {
  Raw,
  Decoded,
}

export interface ECViewerProps {
  id: string;
  raw: string;
  decoded: { [key: string]: string };
}

export const JWTViewer = ({ id, raw, decoded }: ECViewerProps) => {
  const decodedStr = JSON.stringify(decoded, null, 4);
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
            <textarea
              className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
              value={decodedStr}
              readOnly
            ></textarea>
          )}
        </div>
      </div>
    </div>
  );
};
