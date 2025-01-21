import { IconAtom } from "./Icon";
import { truncateMiddle } from "../lib/utils";
import style from "../css/ContextMenu.module.css";
import { on } from "events";

export interface EntityItemsRendererProps {
  discovering: boolean;
  isDiscovered: (dep: string) => boolean;
  isInDiscovery: (dep: string) => boolean;
  removeEntity: (dep: string | string[]) => void;
  addEntities: (dep?: string | string[]) => void;
  removeAllEntities: () => void;
  isFailed: (node: string) => boolean;
  onSelection: (node: string) => void;
}

export const EntityItemsRenderer = ({
  discovering,
  isDiscovered,
  isInDiscovery,
  removeEntity,
  addEntities,
  removeAllEntities,
  isFailed,
}: EntityItemsRendererProps): React.ComponentType<{ items: any[] }> => {
  const getButtonColor = (dep: string) => {
    if (isFailed(dep)) return "btn-secondary";
    if (isDiscovered(dep)) return "btn-danger";
    return "btn-success";
  };

  const getButtonIcon = (dep: string) => {
    if (isFailed(dep)) return "#it-warning";
    if (isDiscovered(dep)) return "#it-minus";
    return "#it-plus";
  };

  const getButtonAction = (dep: string) => {
    if (isFailed(dep)) return () => {};
    if (isDiscovered(dep)) return () => removeEntity(dep);
    return () => addEntities(dep);
  };

  return ({ items }: { items: any[] }) => {
    return (
      <>
        <ul style={{ listStyleType: "none", paddingLeft: "0.8rem" }}>
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
                    ) : (
                      <button
                        className={`btn btn-icon btn-sm py-0 px-1 ${getButtonColor(dep)}`}
                        title="Remove"
                        aria-label="Remove"
                        onClick={getButtonAction(dep)}
                        disabled={discovering || isFailed(dep)}
                      >
                        <IconAtom
                          iconID={getButtonIcon(dep)}
                          className="icon-xs icon-white"
                          isRounded={false}
                        />
                      </button>
                    )}
                  </div>
                  <div className="col-md-auto">
                    <button
                      className="btn btn-icon btn-sm py-0 px-1 btn-primary"
                      title="Highlight"
                      aria-label="Highlight"
                      onClick={() => onSelection(dep)}
                      disabled={!isDiscovered(dep)}
                    >
                      <IconAtom
                        iconID="#it-search"
                        className="icon-xs icon-white"
                        isRounded={false}
                      />
                    </button>
                  </div>
                  <div className="col-md-auto">
                    <span
                      className={style.contextAccordinText}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {truncateMiddle(dep, 53)}
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
                onClick={() => addEntities(items)}
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
                onClick={() => addEntities()}
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
                onClick={removeAllEntities}
                disabled={discovering}
              >
                <IconAtom
                  iconID="#it-restore"
                  className="icon-xs icon-white"
                  isRounded={false}
                />
                <span className={style.contextAccordinButton}>
                  Remove All
                </span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
};
