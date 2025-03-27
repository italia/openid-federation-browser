import React from "react";
import { IntlProvider } from "react-intl";
import { getTranslations } from "../lib/translations";
import { GraphEdge, GraphNode } from "../lib/graph-data/types";
import { isNode } from "../lib/graph-data/utils";
import { NodeMenuAtom } from "../atoms/NodeMenu";
import { EdgeMenuAtom } from "../atoms/EdgeMenu";
import { IconAtom } from "../atoms/Icon";
import { useEffect } from "react";
import { handleKeyDownEvent } from "../lib/utils";
import styles from "../css/ContextMenu.module.css";
import { useState, useRef } from "react";
import { InternalGraphNode, InternalGraphEdge } from "reagraph";

export interface ContextMenuProps {
  data: InternalGraphNode | InternalGraphEdge;
  currentContextMenu?: string;
  onClose: (freeCM: boolean) => void;
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

export const ContextMenuComponent = ({
  data,
  currentContextMenu,
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
}: ContextMenuProps) => {
  if (currentContextMenu !== data.id) {
    onClose(false);
  }

  const nodeCheck = isNode(data);
  const [isDragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const frameID = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const dragX = useRef(0);
  const dragY = useRef(0);

  const handleMove = (e: PointerEvent) => {
    if (!isDragging || !ref.current) {
      return;
    }

    const container = document.getElementById("content-body") as HTMLDivElement;

    const deltaX = lastX.current - e.pageX;
    const deltaY = lastY.current - e.pageY;
    lastX.current = e.pageX;
    lastY.current = e.pageY;
    dragX.current -= deltaX;
    dragY.current -= deltaY;

    const maxDragX = (container.offsetWidth - ref.current.offsetWidth) / 2;
    const maxDragY = (container.offsetHeight - ref.current.offsetHeight) / 2;

    dragX.current = Math.max(-maxDragX, Math.min(dragX.current, maxDragX));
    dragY.current = Math.max(-maxDragY, Math.min(dragY.current, maxDragY));

    cancelAnimationFrame(frameID.current);
    frameID.current = requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${dragX.current}px, ${dragY.current}px, 0)`;
      }
    });
  };

  const handleMouseDown = (e: React.PointerEvent<HTMLDivElement>) => {
    lastX.current = e.pageX;
    lastY.current = e.pageY;
    setDragging(true);
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    document.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerup", handleMouseUp);

    return () => {
      document.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  useEffect(
    () => handleKeyDownEvent("Escape", () => onClose(true)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div ref={ref} style={{ minWidth: "34rem" }}>
      <IntlProvider
        locale={navigator.language.split(",")[0]}
        defaultLocale="en-EN"
        messages={getTranslations(navigator.language)}
      >
        <div className={`container ${styles.contextMenu}`}>
          <div
            className="row primary-bg pt-1 pb-1"
            onMouseDown={handleMouseDown}
          >
            <div
              className="col-md-auto"
              style={{ position: "relative", top: "-2px" }}
              onClick={() => onClose(true)}
            >
              <IconAtom iconID="#it-close" className="icon-sm icon-white" />
            </div>
            <div
              className={`col-md-10 ${styles.contextHeaderText}`}
              style={{ userSelect: "none" }}
            >
              Inspection Window
            </div>
            <div
              className="col-md-auto"
              style={{ marginRight: "-65px" }}
              onClick={() => {
                if (nodeCheck) onNodesRemove([data.id]);
                else onEdgeRemove(data.id);
                onClose(true);
              }}
            >
              <IconAtom iconID="#it-delete" className="icon-sm icon-white" />
            </div>
          </div>
          {nodeCheck ? (
            <NodeMenuAtom
              data={data as GraphNode}
              onNodesRemove={onNodesRemove}
              onNodesAdd={onNodesAdd}
              onEdgeAdd={(node: string) => onEdgeAdd(data.id, node)}
              isFailed={isFailed}
              isInDiscoveryQueue={isInDiscoveryQueue}
              isDiscovered={isDiscovered}
              onSelection={onSelection}
              onModalError={onModalError}
              isDisconnected={(node: string) => isDisconnected(data.id, node)}
            />
          ) : (
            <EdgeMenuAtom data={data as GraphEdge} />
          )}
        </div>
      </IntlProvider>
    </div>
  );
};
