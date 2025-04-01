import React from "react";
import { IntlProvider } from "react-intl";
import { getTranslations } from "../lib/translations";
import { GraphEdge, GraphNode } from "../lib/graph-data/types";
import { isNode } from "../lib/graph-data/utils";
import { NodeMenuAtom } from "../atoms/NodeMenu";
import { EdgeMenuAtom } from "../atoms/EdgeMenu";
import { IconAtom } from "../atoms/Icon";
import { InternalGraphNode, InternalGraphEdge } from "reagraph";
import { Button } from "../atoms/Button";

export interface ContextSideBarProps {
  visible: boolean;
  currentVisualizedData?: InternalGraphNode | InternalGraphEdge;
  onClose: () => void;
  onNodesAdd: (nodes: string[]) => void;
  onNodesRemove: (nodes: string[]) => void;
  onEdgeAdd: (nodeA: string, nodeB: string) => void;
  onEdgeRemove: (id: string) => void;
  onModalError: (message?: string[]) => void;
  isInDiscoveryQueue: (dep: string) => boolean;
  isDisconnected: (nodeA: string, nodeB: string) => boolean;
  isFailed: (node: string) => boolean;
  isDiscovered: (node: string) => boolean;
  onSelection: (node: string) => void;
}

export const ContextSideBar = ({
  visible,
  onClose,
  onNodesAdd,
  onNodesRemove,
  onEdgeAdd,
  onEdgeRemove,
  onModalError,
  isDisconnected,
  isDiscovered,
  isInDiscoveryQueue,
  isFailed,
  onSelection,
  currentVisualizedData,
}: ContextSideBarProps) => {
  const dataPresent = currentVisualizedData !== undefined;

  return (
    <IntlProvider
      locale={navigator.language.split(",")[0]}
      defaultLocale="en-EN"
      messages={getTranslations(navigator.language)}
    >
      <div
        className={`sidebar-wrapper ${visible ? "show" : "collapse"}`}
        style={{
          border: "solid hsl(210,4%,78%)",
          backgroundColor: "hsl(0, 0%, 96%)",
          height: "88%",
          zIndex: 10,
          position: "absolute",
          minWidth: "34rem",
          top: "110px",
          left: "0px",
          width: "34rem",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <h3>Inspection Window</h3>
            </div>
            <div className="col-md-auto" onClick={() => onClose()}>
              <IconAtom iconID="#it-close" className="icon-sm" />
            </div>
          </div>
        </div>
        {dataPresent ? (
          isNode(currentVisualizedData) ? (
            <NodeMenuAtom
              data={currentVisualizedData as GraphNode}
              onNodesRemove={onNodesRemove}
              onNodesAdd={onNodesAdd}
              onEdgeAdd={(node: string) =>
                onEdgeAdd(currentVisualizedData.id, node)
              }
              isFailed={isFailed}
              isInDiscoveryQueue={isInDiscoveryQueue}
              isDiscovered={isDiscovered}
              onSelection={onSelection}
              onModalError={onModalError}
              isDisconnected={(node: string) =>
                isDisconnected(currentVisualizedData.id, node)
              }
            />
          ) : (
            <EdgeMenuAtom data={currentVisualizedData as GraphEdge} />
          )
        ) : (
          <div className="alert alert-warning" role="alert">
            <IconAtom iconID="#it-warning" className="icon-sm" />
            <span>No data Selected</span>
          </div>
        )}

        <div className="col-md-10" style={{ position: "relative", top: "10px" }}>
          <Button
            text={"Delete element from graph"}
            iconID="#it-delete"
            btnClassName="btn btn-danger btn-sm"
            action={() => {
              if (!dataPresent) {
                return;
              }
              if (isNode(currentVisualizedData)) {
                onNodesRemove([currentVisualizedData.id]);
              } else {
                onEdgeRemove(currentVisualizedData.id);
              }
              onClose();
            }}
          />
        </div>
      </div>
    </IntlProvider>
  );
};
