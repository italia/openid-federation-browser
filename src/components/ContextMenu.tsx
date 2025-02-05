import React from "react";
import { IntlProvider } from "react-intl";
import { getTranslations } from "../lib/translations";
import { GraphEdge, GraphNode, Graph } from "../lib/graph-data/types";
import { isNode, removeNode } from "../lib/graph-data/utils";
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
  graph: Graph;
  currentContextMenu?: string;
  onClose: (freeCM: boolean) => void;
  onUpdate: (graph: Graph) => void;
  addToFailedList: (nodes: string[]) => void;
  isFailed: (node: string) => boolean;
  onSelection: (node: string) => void;
}

export const ContextMenuComponent = ({
  data,
  graph,
  currentContextMenu,
  onClose,
  onUpdate,
  addToFailedList,
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

  const handleMove = (e: MouseEvent) => {
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    lastX.current = e.pageX;
    lastY.current = e.pageY;
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  useEffect(
    () => handleKeyDownEvent("Escape", () => onClose(true)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const removeEntity = () => {
    if (nodeCheck) {
      onClose(true);
      onUpdate(removeNode(graph, data.id));
    } else {
      onClose(true);
      const edges = graph.edges.filter((edge) => edge.id !== data.id);
      onUpdate({ nodes: graph.nodes, edges });
    }
  };

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
              onClick={removeEntity}
            >
              <IconAtom iconID="#it-delete" className="icon-sm icon-white" />
            </div>
          </div>
          {nodeCheck ? (
            <NodeMenuAtom
              data={data as GraphNode}
              graph={graph}
              onUpdate={onUpdate}
              addToFailedList={addToFailedList}
              isFailed={isFailed}
              onSelection={onSelection}
            />
          ) : (
            <EdgeMenuAtom data={data as GraphEdge} />
          )}
        </div>
      </IntlProvider>
    </div>
  );
};
