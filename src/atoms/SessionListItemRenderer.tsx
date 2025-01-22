import { useSearchParams } from "react-router-dom";
import { PaginatedListAtom } from "./PaginatedList";
import { IconAtom } from "./Icon";
import { getSessionsList, restoreSession } from "../lib/utils";
import { deleteSession } from "../lib/utils";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { ViewImportAtom } from "./ViewImport";
import style from "../css/ContextMenu.module.css";

export const SessionListItemRendererAtom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState<any[]>(getSessionsList());

  const ItemsRenderer = ({ items }: { items: any[] }) => {
    return (
      <ul style={{ listStyleType: "none" }}>
        {items &&
          items.map((d) => (
            <li key={d.sessionName}>
              <div className="row justify-content-md-start">
                <div className="col-md-auto">
                  <button
                    className={`btn btn-icon btn-sm py-0 px-1 btn-success`}
                    title="Load"
                    aria-label="Load"
                    onClick={() => {
                      restoreSession(d.sessionName);
                      setSearchParams({ graphView: "" });
                    }}
                  >
                    <IconAtom
                      iconID="#it-plus"
                      className="icon-xs icon-white"
                      isRounded={false}
                    />
                    <span className={style.contextAccordinButton}>Restore</span>
                  </button>
                </div>
                <div className="col-md-auto">
                  <button
                    className={`btn btn-icon btn-sm py-0 px-1 btn-danger`}
                    title="Delete"
                    aria-label="Delete"
                    onClick={() => {
                      deleteSession(d.sessionName);
                      setSessions([...getSessionsList()]);
                    }}
                  >
                    <IconAtom
                      iconID="#it-minus"
                      className="icon-xs icon-white"
                      isRounded={false}
                    />
                    <span className={style.contextAccordinButton}>Delete</span>
                  </button>
                </div>
                <div className="col-md-auto">{d.label}</div>
              </div>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <h6>
            <FormattedMessage id="restore_view_file" />
          </h6>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col">
          <ViewImportAtom />
        </div>
      </div>
      <hr />
      {sessions.length === 0 ? (
        <div>
          <h6>
            <FormattedMessage id="no_session_available" />
          </h6>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col">
              <h6>
                <FormattedMessage id="restore_view_previous" />
              </h6>
            </div>
          </div>
          <PaginatedListAtom
            itemsPerPage={5}
            items={sessions}
            ItemsRenderer={ItemsRenderer}
            filterFn={undefined}
          />
        </>
      )}
    </>
  );
};
