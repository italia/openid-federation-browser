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
import { IconAtom } from "../atoms/Icon";
import { downloadJsonFile } from "../lib/utils";
import { exportView, importView } from "../lib/openid-federation/trustChain";
import { WarningModalAtom } from "../atoms/WarningModal";
import { showModal } from "../lib/utils";

enum ShowElement {
  Loading = "loading-atom",
  Error = "error-atom",
  Graph = "graph-atom",
}

export interface GraphViewProps {
  view?: string;
  url?: string;
}

export const GraphViewComponent = ({ view, url }: GraphViewProps) => {
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
  };

  const isFailed = (node: string) => failedNodes.includes(node);

  const onUpdate = (newGraph: Graph) => updateGraph(newGraph);

  useEffect(() => {
    if (view) {
      importView(view).then(updateGraph).catch(showErrorMessage);
      return;
    }

    const entityUrl = url as string;

    const discoveryGraph =
      searchParams.get("discoveryType") === "entity"
        ? traverseUp(entityUrl)
        : discovery(entityUrl).then(fromNodeInfo);

    discoveryGraph.then(updateGraph).catch(showErrorMessage);
  }, [searchParams]);

  return (
    <>
      <WarningModalAtom
        modalID="export-modal"
        headerID="static_dynamic_title"
        descriptionID="static_dynamic_choice_message"
        dismissActionID="dynamic"
        acceptActionID="static"
        onAccept={() => downloadJsonFile(exportView({ nodes, edges }, true))}
        onDismiss={() => downloadJsonFile(exportView({ nodes, edges }, false))}
      />
      <div className={styles.graphAtom}>
        {showElement === ShowElement.Loading ? (
          <LoadingAtom />
        ) : showElement === ShowElement.Error ? (
          <ErrorViewAtom error={error} />
        ) : (
          <>
            <div
              style={{
                zIndex: 9,
                position: "absolute",
                top: 15,
                right: 15,
                padding: 1,
                color: "white",
              }}
            >
              <button
                className="btn btn-success btn-sm py-1 px-2"
                style={{ display: "block", width: "100%" }}
                onClick={() => showModal("export-modal")}
              >
                <IconAtom
                  iconID="#it-download"
                  className="icon-sm icon-white"
                  isRounded={false}
                />
                Export
              </button>
            </div>
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
          </>
        )}
      </div>
    </>
  );
};
