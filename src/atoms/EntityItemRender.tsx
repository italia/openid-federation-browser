import React from "react";
import { Button } from "./Button";
import { truncateMiddle } from "../lib/utils";
import style from "../css/ContextMenu.module.css";

export interface EntityItemsRendererProps {
  isInDiscoveryQueue: (dep: string) => boolean;
  onNodesRemove: (dep: string[]) => void;
  addEntities: (dep?: string | string[]) => void;
  removeAllEntities: () => void;
  isFailed: (node: string) => boolean;
  isDiscovered: (node: string) => boolean;
  onSelection: (node: string) => void;
  isDisconnected: (node: string) => boolean;
  onEdgeAdd: (node: string) => void;
}

export const EntityItemsRenderer = ({
  isInDiscoveryQueue,
  onNodesRemove,
  addEntities,
  removeAllEntities,
  isFailed,
  isDiscovered,
  onSelection,
  isDisconnected,
  onEdgeAdd,
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
      if (isDisconnected(dep)) return () => onEdgeAdd(dep);
      return () => onNodesRemove([dep]);
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
                    {isInDiscoveryQueue(dep) ? (
                      <div className="progress-spinner progress-spinner-double size-sm progress-spinner-active">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <Button
                        action={getButtonAction(dep)}
                        iconID={getButtonIcon(dep)}
                        btnClassName={`btn-sm py-0 px-1 ${getButtonColor(dep)}`}
                        title="Remove"
                        ariaLabel="Remove"
                        disabled={isFailed(dep)}
                      />
                    )}
                  </div>
                  <div className="col-md-auto">
                    <Button
                      action={() => onSelection(dep)}
                      iconID="#it-search"
                      btnClassName="btn-sm py-0 px-1 btn-primary"
                      title="Highlight"
                      ariaLabel="Highlight"
                      disabled={!isInDiscoveryQueue(dep)}
                    />
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
              <Button
                action={() => addEntities(items)}
                iconID="#it-plus"
                btnClassName="btn-sm py-0 px-1 btn-primary"
                title="Discovery"
                ariaLabel="Discovery"
                text="Add all in this page"
                textClassName={style.contextAccordinButton}
              />
            </div>
            <div className="col-md-auto">
              <Button
                action={removeAllEntities}
                iconID="#it-restore"
                btnClassName="btn-sm py-0 px-1 btn-warning"
                title="Discovery"
                ariaLabel="Discovery"
                text="Remove All"
                textClassName={style.contextAccordinButton}
              />
            </div>
            <div className="col-md-auto">
              <Button
                action={() => addEntities()}
                iconID="#it-plus-circle"
                btnClassName="btn-sm py-0 px-1 btn-secondary"
                title="Discovery"
                ariaLabel="Discovery"
                text="Add all filtered"
                textClassName={style.contextAccordinButton}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return renderer;
};
