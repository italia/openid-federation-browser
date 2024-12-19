import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
import { InfoView } from "../atoms/InfoView";
import { GraphNode, Graph } from "../lib/grap-data/types";
import { removeSubGraph } from "../lib/grap-data/utils";
import { discoverMultipleChildren } from "../lib/openid-federation/trustChain";
import { NoImmSubAtom } from "../atoms/NoImmSub";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { SubListItemsRenderer } from "./SubListItemRender";
import { useEffect, useState } from "react";
import { WarningModalAtom } from "./WarningModal";
import { toggleModal, fmtValidity } from "../lib/utils";

export interface ContextMenuProps {
  data: GraphNode;
  graph: Graph;
  onUpdate: (tree: Graph) => void;
  onError: (error: Error) => void;
}

export const NodeMenuAtom = ({
  data,
  graph,
  onUpdate,
  onError,
}: ContextMenuProps) => {
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [discoveringList, setDiscoveringList] = useState<string[]>([]);
  const [discovering, setDiscovering] = useState(false);

  const addSubordinates = (entityID?: string | string[]) => {
    if (!entityID) setDiscoveringList(filteredItems);
    else setDiscoveringList(Array.isArray(entityID) ? entityID : [entityID]);
  };

  const removeSubordinates = (entityIDs: string | string[]) => {
    const newGraph = Array.isArray(entityIDs)
      ? entityIDs.reduce((acc, id) => removeSubGraph(acc, id), graph)
      : removeSubGraph(graph, entityIDs);

    onUpdate(newGraph);
  };

  const isDiscovered = (dep: string) =>
    graph.nodes.find((node) => node.id === dep) ? true : false;
  const isInDiscovery = (dep: string) => discoveringList.includes(dep);

  const removeAllSubordinates = () =>
    removeSubordinates(
      data.info.immDependants.filter((dep) => isDiscovered(dep)),
    );

  const onFilteredList = (items: string[]) => setFilteredItems(items);

  const immediateFilter = (anchor: string, filterValue: string) =>
    anchor.toLowerCase().includes(filterValue.toLowerCase());

  const startDiscovery = () => {
    setDiscovering(true);

    discoverMultipleChildren(discoveringList, data.info, graph)
      .then(onUpdate)
      .catch(onError)
      .finally(() => setDiscovering(false));
  };

  useEffect(() => {
    if (discoveringList.length === 0) return;
    if (discoveringList.length === 1) {
      startDiscovery();
      return;
    }

    toggleModal("warning-modal");
  }, [discoveringList]);

  const displayedInfo = [
    ["federation_entity_type_label", data.info.type],
    ["immediate_subordinate_count_label", data.info.immDependants.length],
    [
      "status_label",
      fmtValidity(data.info.ec.valid, data.info.ec.invalidReason),
    ],
    [
      "expiring_date_label",
      new Date(data.info.ec.payload.exp * 1000).toLocaleString(),
    ],
  ];

  return (
    <>
      <WarningModalAtom
        modalID="warning-modal"
        headerID="warning_modal_title"
        descriptionID="warning_modal_message"
        dismissActionID="modal_cancel"
        acceptActionID="modal_confirm"
        onAccept={startDiscovery}
        onDismiss={() => setDiscoveringList([])}
      />
      <div className="row">
        <div className="accordion">
          <AccordionAtom
            accordinId="info-details"
            labelId="node_info"
            hiddenElement={
              <InfoView
                id={`${data.info.ec.entity}-view`}
                infos={displayedInfo}
              />
            }
          />
          <AccordionAtom
            accordinId="immediate-subordinates-list"
            labelId="subordinate_list"
            hiddenElement={
              data.info.immDependants.length === 0 ? (
                <NoImmSubAtom />
              ) : (
                <PaginatedListAtom
                  items={data.info.immDependants}
                  itemsPerPage={5}
                  ItemsRenderer={SubListItemsRenderer({
                    discovering,
                    isDiscovered,
                    isInDiscovery,
                    addSubordinates,
                    removeSubordinates,
                    removeAllSubordinates,
                  })}
                  filterFn={immediateFilter}
                  onItemsFiltered={onFilteredList}
                />
              )
            }
          />
          <AccordionAtom
            accordinId="entity-configuration"
            labelId="subordinate_statement_data"
            hiddenElement={
              <JWTViewer
                id="node-viewer"
                raw={data.info.ec.jwt}
                decoded={data.info.ec.payload as any}
              />
            }
          />
        </div>
      </div>
    </>
  );
};
