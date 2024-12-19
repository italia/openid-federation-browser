import { IconAtom } from "./Icon";
import { truncateMiddle } from "../lib/utils";
import style from "../css/ContextMenu.module.css";

export interface SubListItemsRendererProps {
  discovering: boolean;
  isDiscovered: (dep: string) => boolean;
  isInDiscovery: (dep: string) => boolean;
  removeSubordinates: (dep: string | string[]) => void;
  addSubordinates: (dep?: string | string[]) => void;
  removeAllSubordinates: () => void;
}

export const SubListItemsRenderer = ({
  discovering,
  isDiscovered,
  isInDiscovery,
  removeSubordinates,
  addSubordinates,
  removeAllSubordinates,
}: SubListItemsRendererProps): React.ComponentType<{ items: any[] }> => {
  return ({ items }: { items: any[] }) => {
    return (
      <>
        <ul style={{ listStyleType: "none" }}>
          {items &&
            items.map((dep) => (
              <li
                key={dep}
                className="it-list-item pt-2"
                style={{ width: "auto", height: "auto" }}
              >
                <div className="row justify-content-md-start">
                  <div className="col-md-auto">
                    {discovering && isInDiscovery(dep) ? (
                      <div className="progress-spinner progress-spinner-double size-sm progress-spinner-active">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : isDiscovered(dep) ? (
                      <button
                        className="btn btn-danger btn-icon btn-sm py-0 px-1"
                        title="Remove"
                        aria-label="Remove"
                        onClick={() => removeSubordinates(dep)}
                        disabled={discovering}
                      >
                        <IconAtom
                          iconID="#it-minus"
                          className="icon-xs icon-white"
                          isRounded={false}
                        />
                      </button>
                    ) : (
                      <button
                        className="btn btn-success btn-icon btn-sm py-0 px-1"
                        title="Add"
                        aria-label="Add"
                        onClick={() => addSubordinates(dep)}
                        disabled={discovering}
                      >
                        <IconAtom
                          iconID="#it-plus"
                          className="icon-xs icon-white"
                          isRounded={false}
                        />
                      </button>
                    )}
                  </div>
                  <div className="col-md-auto">
                    <span
                      className={style.contextAccordinText}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {truncateMiddle(dep, 57)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <div className="container justify-content-md-between">
          <div className="row">
            <div className="col-md-auto">
              <button
                className="btn btn-primary btn-icon btn-xs py-1 px-1"
                title="Discovery"
                aria-label="Discovery"
                onClick={() => addSubordinates(items)}
                disabled={discovering}
              >
                <IconAtom
                  iconID="#it-plus"
                  className="icon-xs icon-white"
                  isRounded={false}
                />
                <span className={style.contextAccordinButton}>
                  Add all in this page
                </span>
              </button>
            </div>
            <div className="col-md-auto">
              <button
                className="btn btn-secondary btn-icon btn-xs py-1 px-1"
                title="Discovery"
                aria-label="Discovery"
                onClick={() => addSubordinates()}
                disabled={discovering}
              >
                <IconAtom
                  iconID="#it-plus-circle"
                  className="icon-xs icon-white"
                  isRounded={false}
                />
                <span className={style.contextAccordinButton}>
                  Add all filtered
                </span>
              </button>
            </div>
            <div className="col-md-auto">
              <button
                className="btn btn-warning btn-icon btn-xs py-1 px-1"
                title="Discovery"
                aria-label="Discovery"
                onClick={removeAllSubordinates}
                disabled={discovering}
              >
                <IconAtom
                  iconID="#it-restore"
                  className="icon-xs icon-white"
                  isRounded={false}
                />
                <span className={style.contextAccordinButton}>
                  Remove All Subordinate
                </span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
};
