import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { traverseUp, discovery } from "../lib/openid-federation/trustChain";
import { GraphCanvas } from "reagraph";
import { GraphNode, GraphEdge, Graph } from "../lib/grap-data/types";
import { ContextMenuComponent } from "./ContextMenu";
import { LoadingAtom } from "../atoms/Loading";
import styles from "../css/BodyComponent.module.css";
import { fromNodeInfo } from "../lib/grap-data/utils";
import { ErrorViewAtom } from "../atoms/ErrorView";

enum ShowElement {
  Loading = "loading-atom",
  Error = "error-atom",
  Graph = "graph-atom",
}

export const GraphViewComponent = () => {
  const [searchParams] = useSearchParams();
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [error, setError] = useState<Error>(new Error(""));
  const [failedNodes, setFailedNodes] = useState<string[]>([]);
  const [showElement, setShowElement] = useState<ShowElement>(
    ShowElement.Loading,
  );

  const updateGraph = ({ nodes, edges }: Graph) => {
    setNodes(nodes);
    setEdges(edges);

    setShowElement(ShowElement.Graph);
  };

  const showErrorMessage = (e: Error) => {
    console.error(e);
    setError(e);
    setShowElement(ShowElement.Error);
  };

  const addToFailedList = (nodes: string[]) => {
    setFailedNodes([...failedNodes, ...nodes]);
  }

  const isFailed = (node: string) => failedNodes.includes(node);

  const onUpdate = (newGraph: Graph) => updateGraph(newGraph);

  useEffect(() => {
    if (!searchParams.has("trustAnchorUrl")) {
      return;
    }

    const entityUrl = searchParams.get("trustAnchorUrl") as string;

    const discoveryGraph =
      searchParams.get("discoveryType") === "entity"
        ? traverseUp(entityUrl)
        : discovery(entityUrl).then(fromNodeInfo);

    discoveryGraph.then(updateGraph).catch(showErrorMessage);
  }, [searchParams]);

  return (
    <>
      <div className={styles.graphAtom}>
        {showElement === ShowElement.Loading ? (
          <LoadingAtom />
        ) : showElement === ShowElement.Error ? (
          <ErrorViewAtom error={error} />
        ) : (
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            draggable
            contextMenu={({ data, onClose }) => (
              <ContextMenuComponent
                data={data as any}
                graph={{ nodes, edges }}
                onClose={onClose}
                onUpdate={onUpdate}
                addToFailedList={addToFailedList}
                isFailed={isFailed}
              />
            )}
          />
        )}
      </div>
    </>
  );
};
