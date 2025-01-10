import { AccordionAtom } from "./Accordion";
import style from "../css/ContextMenu.module.css";
import { IconAtom } from "./Icon";

export interface ECViewerProps {
  raw: string;
  decodedPayload: { [key: string]: string };
  decodedHeader: { [key: string]: string };
}

export const JWTViewer = ({
  raw,
  decodedPayload,
  decodedHeader,
}: ECViewerProps) => {
  const decodedPayloadStr = JSON.stringify(decodedPayload, null, 4);
  const decodedHeaderStr = JSON.stringify(decodedHeader, null, 4);

  return (
    <div className="container" style={{ width: "100%", padding: "14px 24px" }}>
      <div className="row" style={{ padding: "8px" }}>
        <div className="col-4">
          <button
            className="btn btn-primary btn-icon btn-xs py-1 px-1"
            title="Discovery"
            aria-label="Discovery"
            onClick={() => navigator.clipboard.writeText(raw)}
          >
            <IconAtom
              iconID="#it-copy"
              className="icon-xs icon-white"
              isRounded={false}
            />
            <span className={style.contextAccordinButton}>Copy raw JWT</span>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <AccordionAtom
            accordinId="header"
            labelId="header"
            titleClassName={style.contextAccordinText}
            hiddenElement={
              <textarea
                className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
                value={decodedHeaderStr}
                style={{ height: "8rem" }}
                readOnly
              ></textarea>
            }
          />
          <AccordionAtom
            accordinId="payload"
            labelId="payload"
            titleClassName={style.contextAccordinText}
            hiddenElement={
              <textarea
                className={`${style.contextAccordinText} ${style.readOnlyTextArea}`}
                value={decodedPayloadStr}
                readOnly
              ></textarea>
            }
          />
        </div>
      </div>
    </div>
  );
};
