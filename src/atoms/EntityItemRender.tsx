import React from "react";
import { IconAtom } from "./Icon";
import { truncateMiddle } from "../lib/utils";
import style from "../css/ContextMenu.module.css";

export interface EntityItemsRendererProps {
  isDiscovered: (dep: string) => boolean;
  discoveringList: string[];
  removeEntity: (dep: string | string[]) => void;
  addEntities: (dep?: string | string[]) => void;
  removeAllEntities: () => void;
  isFailed: (node: string) => boolean;
  onSelection: (node: string) => void;
  isDisconnected: (node: string) => boolean;
  addEdge: (node: string) => void;
}

export const EntityItemsRenderer = ({
  isDiscovered,
  discoveringList,
  removeEntity,
  addEntities,
  removeAllEntities,
  isFailed,
  onSelection,
  isDisconnected,
  addEdge,
}: EntityItemsRendererProps): React.ComponentType<{ items: string[] }> => {
  const getButtonColor = (dep: string) => {
    if (isFailed(dep)) return "btn-secondary";

    if (isDiscovered(dep)) {
      if (isDisconnected(dep)) return "btn-warning";
      return "btn-danger";
    }

    return "btn-success";
  };

  const getButtonIcon = (dep: string) => {
    if (isFailed(dep)) return "#it-warning";

    if (isDiscovered(dep)) {
      if (isDisconnected(dep)) return "#it-plug";
      return "#it-minus";
    }

    return "#it-plus";
  };

  const getButtonAction = (dep: string): (() => void) => {
    if (isFailed(dep)) return () => {};

    if (isDiscovered(dep)) {
      if (isDisconnected(dep)) return () => addEdge(dep);
      return () => removeEntity(dep);
    }

    return () => addEntities(dep);
  };

  const renderer = ({ items }: { items: string[] }) => {
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
                    {discoveringList.includes(dep) ? (
                      <div className="progress-spinner progress-spinner-double size-sm progress-spinner-active">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <button
                        className={`btn btn-icon btn-sm py-0 px-1 ${getButtonColor(dep)}`}
                        title="Remove"
                        aria-label="Remove"
                        onClick={getButtonAction(dep)}
                        disabled={isFailed(dep)}
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
              >
                <IconAtom
                  iconID="#it-restore"
                  className="icon-xs icon-white"
                  isRounded={false}
                />
                <span className={style.contextAccordinButton}>Remove All</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return renderer;
};
