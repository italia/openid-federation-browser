import { useEffect, useState } from "react";
import { discovery, traverseUp } from "../lib/openid-federation/trustChain";
import { GraphCanvas } from "reagraph";
import { GraphNode, GraphEdge, Graph } from "../lib/graph-data/types";
import { ContextMenuComponent } from "./ContextMenu";
import { LoadingAtom } from "../atoms/Loading";
import styles from "../css/BodyComponent.module.css";
import headerStyle from "../css/Header.module.css";
import { fromNodeInfo } from "../lib/graph-data/utils";
import { ErrorViewAtom } from "../atoms/ErrorView";
import { IconAtom } from "../atoms/Icon";
import { downloadJsonFile } from "../lib/utils";
import { exportView, importView } from "../lib/openid-federation/trustChain";
import { WarningModalAtom } from "../atoms/WarningModal";
import { showModal } from "../lib/utils";
import { persistSession } from "../lib/utils";

enum ShowElement {
  Loading = "loading-atom",
  Error = "error-atom",
  Graph = "graph-atom",
}

export const GraphViewComponent = () => {
  const [update, setUpdate] = useState(false);
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

    sessionStorage.setItem("currentSession", JSON.stringify({ nodes, edges }));

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
    window.addEventListener("trustAnchorUrl", () => {
      setUpdate(true);
    });
    window.addEventListener("currentSession", () => {
      setUpdate(true);
    });
  }, []);

  useEffect(() => {
    const view = sessionStorage.getItem("currentSession");

    if (view) {
      importView(view).then(updateGraph).catch(showErrorMessage);
      return;
    }

    const trustAnchorUrl = sessionStorage.getItem("trustAnchorUrl");

    if (!trustAnchorUrl) return;

    const { url, searchType } = JSON.parse(trustAnchorUrl);

    const discoveryGraph =
      searchType === "entity"
        ? traverseUp(url)
        : discovery(url).then(fromNodeInfo);

    discoveryGraph.then(updateGraph).catch(showErrorMessage);

    setUpdate(false);
  }, [update]);

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
                className={`btn btn-success btn-sm py-1 px-2 ${headerStyle.headerText}`}
                style={{ display: "block", width: "100%" }}
                onClick={() => showModal("export-modal")}
              >
                <IconAtom
                  iconID="#it-download"
                  className="icon-sm icon-white"
                  isRounded={false}
                />
                <span style={{ marginLeft: "5px" }}>Export</span>
              </button>
              <button
                className={`btn btn-success btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
                style={{ display: "block", width: "100%" }}
                onClick={() => persistSession()}
              >
                <IconAtom
                  iconID="#it-bookmark"
                  className="icon-sm icon-white"
                  isRounded={false}
                />
                <span style={{ marginLeft: "5px" }}>Save</span>
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
