import React from "react";
import { useEffect, useState } from "react";
import { discoverNode, traverseUp } from "../lib/openid-federation/trustChain";
import { GraphCanvas, GraphCanvasRef } from "reagraph";
import { GraphNode, GraphEdge, Graph } from "../lib/graph-data/types";
import { ContextMenuComponent } from "./ContextMenu";
import { LoadingAtom } from "../atoms/Loading";
import { ErrorViewAtom } from "../atoms/ErrorView";
import { downloadJsonFile } from "../lib/utils";
import { exportView, importView } from "../lib/openid-federation/trustChain";
import { WarningModalAtom } from "../atoms/WarningModal";
import { showModal } from "../lib/utils";
import { persistSession } from "../lib/utils";
import { InputModalAtom } from "../atoms/InputModal";
import { GraphControlMenuAtom } from "../atoms/GraphControlMenu";
import { evaluateTrustChain } from "../lib/openid-federation/trustChain";
import { useRef } from "react";
import { isValidUrl } from "../lib/utils";
import { cleanEntityID } from "../lib/utils";
import { genEdge } from "../lib/graph-data/utils";
import { FormattedMessage } from "react-intl";
import { InternalGraphNode, InternalGraphEdge } from "reagraph/dist/types";
import { discoverNodes } from "../lib/openid-federation/trustChain";
import { isModalShowed } from "../lib/utils";
import { areDisconnected } from "../lib/graph-data/utils";
import styles from "../css/BodyComponent.module.css";
import headerStyle from "../css/Header.module.css";

import { removeEntities as _removeEntities } from "../lib/graph-data/utils";

enum ShowElement {
  Loading = "loading-atom",
  Error = "error-atom",
  Graph = "graph-atom",
}

export const GraphView = () => {
  const ref = useRef<GraphCanvasRef | null>(null);
  const [update, setUpdate] = useState(false);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [actives, setActives] = useState<string[]>([]);
  const [selections, setSelections] = useState<string[]>([]);
  const [highlighting, setHighlighting] = useState<boolean>(false);
  const [tc, setTc] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<string>("");
  const [error, setError] = useState<Error>(new Error(""));
  const [failedNodes, setFailedNodes] = useState<string[]>([]);
  const [currentContextMenu, setCurrentContextMenu] = useState<
    InternalGraphNode | InternalGraphEdge | undefined
  >(undefined);
  const [errorModalText, setErrorModalText] = useState(new Error());
  const [errorDetails, setErrorDetails] = useState<string[] | undefined>(
    undefined,
  );
  const [discoverQueue, setDiscoveryQueue] = useState<string[]>([]);
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

  const isFailed = (node: string) => failedNodes.includes(node);
  const isDiscovered = (node: string) => nodes.some((n) => n.id === node);
  const isDisconnected = (nodeA: string, nodeB: string) =>
    areDisconnected({nodes, edges}, nodeA, nodeB);

  const showNotification = () => {
    const savedNotification = document.getElementById("notification");
    if (savedNotification) {
      savedNotification.style.display = "block";
      setTimeout(() => {
        savedNotification.style.display = "none";
      }, 5000);
    }
  };

  const saveSession = (name: string) => {
    setNotification(`Saved: ${name.replace("session-", "")}`);
    persistSession(ref.current?.exportCanvas() as string);
    showNotification();
  };

  const onSessionSave = () => {
    const sessionName = sessionStorage.getItem("currentSessionName");

    if (sessionName) {
      saveSession(sessionName);
    } else {
      showModal("save-title-modal");
    }
  };

  const onEntityAdd = () => showModal("add-entity-modal");

  const onExport = () => showModal("export-modal");

  const onTCCopy = () => {
    if (!tc) return;
    navigator.clipboard.writeText(tc);
    setNotification("Trust Chain copied to clipboard");
    showNotification();
  };

  const onNodesRemove = (entities: string[]) => {
    const newGraph = _removeEntities({ nodes, edges }, entities);
    updateGraph(newGraph);
  };

  const onModalError = (details?: string[]) => {
    if (isModalShowed("error-modal")) {
      const failed = [...(details || []), ...(errorDetails || [])];

      setErrorModalText(
        new Error(`Failed to discover ${failed.length} entities`),
      );

      setErrorDetails(failed);
      return;
    }

    setErrorModalText(
      new Error(`Failed to discover ${(details || []).length} entities`),
    );
    setErrorDetails(details);
    showModal("error-modal");
  };

  const onEdgeAdd = (nodeA: string, nodeB: string) => {
    const nodeAData = nodes.find(
      (node) => cleanEntityID(node.id) === cleanEntityID(nodeA)      
    );

    const nodeBData = nodes.find(
      (node) => cleanEntityID(node.id) === cleanEntityID(nodeB)
    );

    if (!nodeAData || !nodeBData) return;

    const isAuthorityHint = nodeAData.info.ec.payload.authority_hints?.some(
      (ah) => cleanEntityID(ah) === cleanEntityID(nodeB),
    );

    const newGraph = {
      nodes: nodes,
      edges: [
        ...edges,
        !isAuthorityHint
          ? genEdge(nodeAData.info, nodeBData.info)
          : genEdge(nodeBData.info, nodeAData.info),
      ],
    };

    updateGraph(newGraph);
  };

  const onEdgeRemove = (id: string) => {
    const newEdges = edges.filter((edge) => edge.id !== id);
    updateGraph({ nodes, edges: newEdges });
  }

  useEffect(
    () => setTc(evaluateTrustChain({ nodes, edges }, selections)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selections],
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
      searchType === "entity" ? traverseUp(url) : discoverNode(url);

    discoveryGraph.then(updateGraph).catch(showErrorMessage);

    setUpdate(false);
  }, [update]);

  useEffect(() => {
    if (discoverQueue.length === 0) return;

    const [discovery, ...rest] = discoverQueue;

    discoverNodes([discovery], { nodes, edges }).then((result) => {
      if (result.failed.find((f) => f.entity === discovery)) {
        setFailedNodes([...failedNodes, discovery]);
        onModalError(result.failed.map((f) => f.error.message));
        setDiscoveryQueue(rest);
      }

      const data = currentContextMenu as GraphNode;

      const isAuthorityHint = data.info.ec.payload.authority_hints?.some(
        (ah) => ah.startsWith(discovery) || discovery.startsWith(ah),
      );

      const newGraph = {
        nodes: result.graph.nodes,
        edges: [
          ...result.graph.edges,
          isAuthorityHint
            ? genEdge(
                result.graph.nodes.find((n) => n.id === discovery)!.info,
                data.info,
              )
            : genEdge(
                data.info,
                result.graph.nodes.find((n) => n.id === discovery)!.info,
              ),
        ],
      };

      updateGraph(newGraph);
      setDiscoveryQueue(rest);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoverQueue]);

  return (
    <>
      <WarningModalAtom
        modalID="error-modal"
        headerID="error_modal_title"
        details={errorDetails}
        description={errorModalText.message}
        dismissActionID="modal_cancel"
      />
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
        inputVerifyFn={(name) => name === ""}
        onAccept={(name) => {
          sessionStorage.setItem("currentSessionName", `session-${name}`);
          setNotification(`Saved: ${name.replace("session-", "")}`);
          persistSession(ref.current?.exportCanvas() as string);
          showNotification();
        }}
      />
      <InputModalAtom
        modalID="add-entity-modal"
        headerID="save_name_title"
        placeorderID="insert_entity_url_label"
        dismissActionID="modal_cancel"
        acceptActionID="add"
        inputVerifyFn={(name) => !isValidUrl(name)}
        onAccept={(entityID) =>
          discoverNode(entityID, { nodes, edges })
            .then(updateGraph)
            .catch(showErrorMessage)
        }
      />
      <div id="content-body" className={styles.graphAtom}>
        {showElement === ShowElement.Loading ? (
          <LoadingAtom />
        ) : showElement === ShowElement.Error ? (
          <ErrorViewAtom error={error} />
        ) : (
          <>
            <GraphControlMenuAtom
              onSessionSave={onSessionSave}
              onExport={onExport}
              onTCCopy={onTCCopy}
              showTCButton={tc !== undefined}
              onEntityAdd={onEntityAdd}
            />
            <GraphCanvas
              ref={ref}
              nodes={nodes}
              edges={edges}
              selections={selections}
              actives={actives}
              onNodeClick={(node) => {
                if (selections.includes(node.id)) {
                  setSelections(selections.filter((n) => n !== node.id));
                  setActives(actives.filter((n) => n !== node.id));
                } else {
                  setSelections([node.id, ...selections]);
                  setActives([node.id, ...actives]);
                }
              }}
              onCanvasClick={() => {
                if (highlighting || currentContextMenu) return;
                setActives([]);
                setSelections([]);
              }}
              lassoType="node"
              onLassoEnd={(selections) => setSelections(selections)}
              draggable
              onNodeContextMenu={(node) => {
                if (currentContextMenu) return;
                setCurrentContextMenu(node);
              }}
              onEdgeContextMenu={(edge) => {
                if (currentContextMenu || !edge) return;
                setCurrentContextMenu(edge);
              }}
              contextMenu={({ data, onClose }) => (
                <ContextMenuComponent
                  data={data}
                  currentContextMenu={currentContextMenu?.id}
                  onClose={(freeCM: boolean) => {
                    onClose();
                    if (freeCM) setCurrentContextMenu(undefined);
                  }}
                  onNodesAdd={(nodes) => setDiscoveryQueue(nodes)}
                  onNodesRemove={onNodesRemove}
                  isFailed={isFailed}
                  onEdgeAdd={onEdgeAdd}
                  onEdgeRemove={onEdgeRemove}
                  onModalError={onModalError}
                  isDisconnected={isDisconnected}
                  isDiscovered={isDiscovered}
                  isInDiscoveryQueue={(node: string) =>
                    discoverQueue.includes(node)
                  }
                  onSelection={(node: string) => {
                    setHighlighting(true);
                    setActives([cleanEntityID(node)]);
                    setSelections([cleanEntityID(node)]);

                    onClose();
                    setCurrentContextMenu(undefined);

                    setTimeout(() => {
                      setHighlighting(false);
                      setSelections([]);
                      setActives([]);
                    }, 2000);
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
      <div
        style={{
          zIndex: 9,
          userSelect: "none",
          position: "absolute",
          bottom: 0,
          right: 0,
          background: "rgba(0, 0, 0, .5)",
          color: "white",
        }}
      >
        <span className={headerStyle.headerText} style={{ margin: 5 }}>
          <FormattedMessage id="drag_info" />
        </span>
      </div>
    </>
  );
};
