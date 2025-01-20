import { useSearchParams } from "react-router-dom";
import { PaginatedListAtom } from "./PaginatedList";
import { IconAtom } from "./Icon";
import { getSessionsList, restoreSession } from "../lib/utils";
import { deleteSession } from "../lib/utils";
import { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

export const SessionListItemRendererAtom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState<any[]>(getSessionsList());
  const [refresh, setRefresh] = useState(false);

  const ItemsRenderer = ({ items }: { items: any[] }) => {
    console.log(items);
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
                      iconID="#it-search"
                      className="icon-xs icon-white"
                      isRounded={false}
                    />
                    Load
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
                      setRefresh(false);
                    }}
                  >
                    <IconAtom
                      iconID="#it-search"
                      className="icon-xs icon-white"
                      isRounded={false}
                    />
                    Delete
                  </button>
                </div>
                <div className="col-md-auto">{d.label}</div>
              </div>
            </li>
          ))}
      </ul>
    );
  };

  useEffect(() => {
    console.error("sessions", sessions);
    setRefresh(true);
  }, [sessions]);

  return (
    <>
      {sessions.length === 0 && (
        <div>
          <h5>
            <FormattedMessage id="no_session_available" />
          </h5>
        </div>
      )}
      {refresh && (
        <PaginatedListAtom
          itemsPerPage={5}
          items={sessions}
          ItemsRenderer={ItemsRenderer}
          filterFn={undefined}
        />
      )}
    </>
  );
};
