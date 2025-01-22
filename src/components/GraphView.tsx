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
import { showModal, hideModal } from "../lib/utils";
import { persistSession } from "../lib/utils";
import { InputModalAtom } from "../atoms/InputModal";
import { evaluateTrustChain } from "../lib/openid-federation/trustChain";

enum ShowElement {
  Loading = "loading-atom",
  Error = "error-atom",
  Graph = "graph-atom",
}

export const GraphViewComponent = () => {
  const [update, setUpdate] = useState(false);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [tc, setTc] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<string>("");
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

  const showNotification = () => {
    const savedNotification = document.getElementById("notification");
    if (savedNotification) {
      savedNotification.style.display = "block";
      setTimeout(() => {
        savedNotification.style.display = "none";
      }, 5000);
    }
  };

  const evaluateTrustChain = () => {
    const selectedNodes = nodes.filter((node) => selected.includes(node.id));
    const leafNodesNumber = selectedNodes.filter(
      (node) => node.info.type === "Leaf",
    ).length;
    const anchorNodesNumber = selectedNodes.filter(
      (node) => node.info.type === "Trust Anchor",
    ).length;

    if (leafNodesNumber !== 1 || anchorNodesNumber !== 1) {
      console.log("Invalid selection");
      setTc(undefined);
      return;
    }

    const affectedEdges = edges.filter(
      (edge) =>
        selected.find(
          (node) => node === edge.source && selected.includes(edge.target),
        ) ||
        selected.find(
          (node) => node === edge.target && selected.includes(edge.source),
        ),
    );

    if (affectedEdges.length === 0) {
      console.log("No edges");
      setTc(undefined);
      return;
    } else if (affectedEdges.length !== selectedNodes.length - 1) {
      console.log(affectedEdges);
      console.log(affectedEdges.length, selectedNodes.length);
      console.log("Invalid edges");
      setTc(undefined);
      return;
    }

    const orderedEdges = affectedEdges.sort((a, b) => {
      const aSource = selectedNodes.find((node) => node.id === a.source);
      const aTarget = selectedNodes.find((node) => node.id === a.target);
      const bSource = selectedNodes.find((node) => node.id === b.source);
      const bTarget = selectedNodes.find((node) => node.id === b.target);

      if (aSource && aTarget && bSource && bTarget) {
        if (
          aSource.info.type === "Trust Anchor" &&
          aTarget.info.type === "Intermediate"
        ) {
          return -1;
        } else if (
          bSource.info.type === "Trust Anchor" &&
          bTarget.info.type === "Intermediate"
        ) {
          return 1;
        } else if (
          aSource.info.type === "Intermediate" &&
          aTarget.info.type === "Leaf"
        ) {
          return -1;
        } else if (
          bSource.info.type === "Intermediate" &&
          bTarget.info.type === "Leaf"
        ) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });

    let currentEdge = orderedEdges[0];

    for (let i = 1; i < orderedEdges.length; i++) {
      if (currentEdge.target === orderedEdges[i].source) {
        currentEdge = orderedEdges[i];
      } else {
        console.log("Invalid chain");
        setTc(undefined);
        return;
      }
    }

    const reversedOrderedEdges = orderedEdges.reverse();

    const trustChain = reversedOrderedEdges.map(
      (edge) => edge.subStatement?.jwt,
    );
    trustChain.unshift(
      selectedNodes.find((node) => node.id == reversedOrderedEdges[0].target)
        ?.info.ec.jwt as string,
    );
    trustChain.push(
      selectedNodes.find(
        (node) =>
          node.id ==
          reversedOrderedEdges[reversedOrderedEdges.length - 1].source,
      )?.info.ec.jwt as string,
    );

    setTc(JSON.stringify(trustChain));
  };

  useEffect(
    () => setTc(evaluateTrustChain({ nodes, edges }, selected)),
    [selected],
  );

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
      <InputModalAtom
        modalID="save-title-modal"
        headerID="save_name_title"
        placeorderID="save_name_message"
        dismissActionID="modal_cancel"
        acceptActionID="save"
        onAccept={(name) => {
          sessionStorage.setItem("currentSessionName", `session-${name}`);
          setNotification(`Saved: ${name.replace("session-", "")}`);
          persistSession();
          showNotification();
        }}
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
              <Link className="nav-link" to="/?viewUpload">
                <button
                  className={`btn btn-success btn-sm py-1 px-2 ${headerStyle.headerText}`}
                  style={{ display: "block", width: "100%" }}
                >
                  <div className="row">
                    <div className="col-2">
                      <IconAtom
                        iconID="#it-upload"
                        className="icon-sm icon-white"
                        isRounded={false}
                      />
                    </div>
                    <div className="col-md-auto">
                      <span>Upload View</span>
                    </div>
                  </div>
                </button>
              </Link>
              <button
                className={`btn btn-success btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
                style={{ display: "block", width: "100%" }}
                onClick={() => showModal("export-modal")}
              >
                <div className="row align-items-start">
                  <div className="col-2">
                    <IconAtom
                      iconID="#it-download"
                      className="icon-sm icon-white"
                      isRounded={false}
                    />
                  </div>
                  <div className="col-md-auto">
                    <span>Export</span>
                  </div>
                </div>
              </button>
              <button
                className={`btn btn-success btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
                style={{ display: "block", width: "100%" }}
                onClick={() => {
                  const sessionName =
                    sessionStorage.getItem("currentSessionName");

                  if (sessionName) {
                    setNotification(
                      `Saved: ${sessionName.replace("session-", "")}`,
                    );
                    persistSession();
                    showNotification();
                  } else {
                    showModal("save-title-modal");
                  }
                }}
              >
                <div className="row">
                  <div className="col-2">
                    <IconAtom
                      iconID="#it-bookmark"
                      className="icon-sm icon-white"
                      isRounded={false}
                    />
                  </div>
                  <div className="col-md-auto">
                    <span>Save</span>
                  </div>
                </div>
              </button>
              {tc && (
                <button
                  className={`btn btn-success btn-sm py-1 px-2 mt-2 ${headerStyle.headerText}`}
                  style={{ display: "block", width: "100%" }}
                  onClick={() => {
                    navigator.clipboard.writeText(tc);
                    setNotification("Trust Chain copied to clipboard");
                    showNotification();
                  }}
                >
                  <div className="row">
                    <div className="col-2">
                      <IconAtom
                        iconID="#it-plug"
                        className="icon-sm icon-white"
                        isRounded={false}
                      />
                    </div>
                    <div className="col-md-auto">
                      <span>Export TC</span>
                    </div>
                  </div>
                </button>
              )}
            </div>
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              onNodeClick={(node) => {
                if (!selected.includes(node.id)) {
                  setSelected([...selected, node.id]);
                } else {
                  setSelected(selected.filter((id) => id !== node.id));
                }
              }}
              draggable
              selections={selected}
              contextMenu={({ data, onClose }) => (
                <ContextMenuComponent
                  data={data as any}
                  graph={{ nodes, edges }}
                  onClose={onClose}
                  onUpdate={onUpdate}
                  addToFailedList={addToFailedList}
                  isFailed={isFailed}
                  onSelection={(node: string) => {
                    setSelected([node]);
                    onClose();
                    setTimeout(() => setSelected([]), 2000);
                  }}
                />
              )}
            />
          </>
        )}
      </div>
      <div
        id="notification"
        style={{
          display: "none",
          zIndex: 9,
          position: "absolute",
          bottom: 20,
          right: 15,
          padding: 1,
          color: "white",
        }}
      >
        <span className="badge bg-success">{notification}</span>
      </div>
    </>
  );
};
