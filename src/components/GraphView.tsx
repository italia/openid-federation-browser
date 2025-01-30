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
import styles from "../css/BodyComponent.module.css";
import headerStyle from "../css/Header.module.css";
import { FormattedMessage } from "react-intl";

enum ShowElement {
  Loading = "loading-atom",
  Error = "error-atom",
  Graph = "graph-atom",
}

export const GraphViewComponent = () => {
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
    string | undefined
  >(undefined);
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

  useEffect(
    () => setTc(evaluateTrustChain({ nodes, edges }, selections)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selections]);

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
      <div className={styles.graphAtom}>
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
                if(selections.includes(node.id)) {
                  setSelections(selections.filter((n) => n !== node.id));
                  setActives(actives.filter((n) => n !== node.id));
                }else {
                  setSelections([node.id, ...selections]);
                  setActives([node.id, ...actives]);
                }
              }}
              onCanvasClick={() => {
                if (highlighting || currentContextMenu) return;
                setActives([]);
                setSelections([])
              }}
              lassoType="node"
              onLassoEnd={(selections) => setSelections(selections)}
              draggable
              onNodeContextMenu={(node) => {
                if (currentContextMenu) return;
                setCurrentContextMenu(node.id);
              }}
              onEdgeContextMenu={(edge) => {
                if (currentContextMenu || !edge) return;
                setCurrentContextMenu(edge.id);
              }}
              contextMenu={({ data, onClose }) => (
                <ContextMenuComponent
                  data={data as any}
                  graph={{ nodes, edges }}
                  currentContextMenu={currentContextMenu}
                  onClose={(freeCM: boolean) => {
                    onClose();
                    if (freeCM) setCurrentContextMenu(undefined);
                  }}
                  onUpdate={onUpdate}
                  addToFailedList={addToFailedList}
                  isFailed={isFailed}
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
      <div style={{ zIndex: 9, userSelect: 'none', position: 'absolute', bottom: 0, right: 0, background: 'rgba(0, 0, 0, .5)', color: 'white' }}>
        <span className={headerStyle.headerText} style={{ margin: 5 }}><FormattedMessage id="drag_info" /></span>
      </div>
    </>
  );
};
