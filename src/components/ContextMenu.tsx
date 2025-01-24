import { IntlProvider } from "react-intl";
import { getTranslations } from "../lib/translations";
import { GraphEdge, GraphNode, Graph } from "../lib/graph-data/types";
import { isNode, removeSubGraph } from "../lib/graph-data/utils";
import { NodeMenuAtom } from "../atoms/NodeMenu";
import { EdgeMenuAtom } from "../atoms/EdgeMenu";
import { FormattedMessage } from "react-intl";
import { IconAtom } from "../atoms/Icon";
import { useEffect } from "react";
import { handleKeyDownEvent } from "../lib/utils";
import styles from "../css/ContextMenu.module.css";
import { useState, useRef } from "react";

export interface ContextMenuProps {
  data: GraphNode | GraphEdge;
  graph: Graph;
  onClose: () => void;
  onUpdate: (graph: Graph) => void;
  addToFailedList: (nodes: string[]) => void;
  isFailed: (node: string) => boolean;
  onSelection: (node: string) => void;
}

export const ContextMenuComponent = ({
  data,
  graph,
  onClose,
  onUpdate,
  addToFailedList,
  isFailed,
  onSelection,
}: ContextMenuProps) => {
  const nodeCheck = isNode(data);

  const [pressed, setPressed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pressed) {
      setPosition({
        x: position.x + event.movementX,
        y: position.y + event.movementY,
      });
    }
  };

  useEffect(() => handleKeyDownEvent("Escape", onClose), []);

  const removeEntity = () => {
    if(nodeCheck) {
      onUpdate(removeSubGraph(graph, data.id));
    } else {
      const edges = graph.edges.filter((edge) => edge.id !== data.id);
      onUpdate({ nodes: graph.nodes, edges });
    }
  };

  return (
    <div ref={ref}>
      <IntlProvider
        locale={navigator.language.split(",")[0]}
        defaultLocale="en-EN"
        messages={getTranslations(navigator.language)}
      >
        <div className={`container ${styles.contextMenu}`}>
          <div
            className="row primary-bg pt-1 pb-1"
            onMouseMove={onMouseMove}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onDragEnd={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
          >
            <div
              className="col-md-auto"
              style={{ position: "relative", top: "-2px" }}
              onClick={onClose}
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
