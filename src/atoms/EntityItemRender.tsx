import React from "react";
import { Button } from "./Button";
import { truncateMiddle } from "../lib/utils";
import style from "../css/ContextMenu.module.css";

export interface EntityItemsRendererProps {
  isInDiscoveryQueue: (dep: string) => boolean;
  onNodesRemove: (dep: string[]) => void;
  addEntities: (dep: string | string[]) => void;
  addFilteredEntities: () => void;
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
  addFilteredEntities,
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
    const notDiscoverdNumber = items.filter((i) => !isDiscovered(i)).length;

    return (
      <>
        <ul style={{ listStyleType: "none", paddingLeft: "0.8rem" }}>
          {items &&
            items.map((dep) => (
              <li
                key={dep}
                className="it-list-item pt-2"
                data-testid="entity-item"
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
                        test_id="add-remove-entities-button"
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
                      test_id="highlight-entities-button"
                      action={() => onSelection(dep)}
                      iconID="#it-pin"
                      btnClassName="btn-sm py-0 px-1 btn-primary"
                      title="Highlight"
                      ariaLabel="Highlight"
                      disabled={!isDiscovered(dep)}
                    />
                  </div>
                  <div className="col-md-auto">
                    <span
                      className={style.contextAccordinText}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {truncateMiddle(dep, 42)}
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
                id="add-all-entities-button"
                action={() => addEntities(items)}
                iconID="#it-plus"
                btnClassName="btn-sm py-0 px-1 btn-primary"
                title="Discovery"
                ariaLabel="Discovery"
                text={`Add all this ${notDiscoverdNumber} in page`}
                disabled={notDiscoverdNumber === 0}
              />
            </div>
            <div className="col-md-auto">
              <Button
                id="remove-all-entities-button"
                action={removeAllEntities}
                iconID="#it-restore"
                btnClassName="btn-sm py-0 px-1 btn-danger"
                title="Discovery"
                ariaLabel="Discovery"
                text="Remove All"
              />
            </div>
            <div className="col-md-auto">
              <Button
                id="add-filtered-entities-button"
                action={addFilteredEntities}
                iconID="#it-plus-circle"
                btnClassName="btn-sm py-0 px-1 btn-outline-primary"
                iconClassName="icon-xs icon-primary"
                title="Discovery"
                ariaLabel="Discovery"
                text="Add all filtered"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return renderer;
};
