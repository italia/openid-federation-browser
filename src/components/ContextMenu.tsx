import { IntlProvider } from "react-intl";
import { getTranslations } from "../lib/translations";
import { GraphEdge, GraphNode, Graph } from "../lib/graph-data/types";
import { isNode } from "../lib/graph-data/utils";
import { NodeMenuAtom } from "../atoms/NodeMenu";
import { EdgeMenuAtom } from "../atoms/EdgeMenu";
import { FormattedMessage } from "react-intl";
import { IconAtom } from "../atoms/Icon";
import { useEffect } from "react";
import { handleKeyDownEvent } from "../lib/utils";
import styles from "../css/ContextMenu.module.css";

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

  useEffect(() => handleKeyDownEvent("Escape", onClose), []);

  return (
    <IntlProvider
      locale={navigator.language}
      defaultLocale="en-EN"
      messages={getTranslations(navigator.language)}
    >
      <div className={`container ${styles.contextMenu}`}>
        <div className="row primary-bg pt-1 pb-1">
          <div
            className="col-md-auto"
            style={{ position: "relative", top: "-2px" }}
            onClick={onClose}
          >
            <IconAtom iconID="#it-close" className="icon-sm icon-white" />
          </div>
          <div className={`col-md-auto ${styles.contextHeaderText}`}>
            {nodeCheck && <FormattedMessage id={"entity_id_label"} />}
            {data.label}
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
  );
};
