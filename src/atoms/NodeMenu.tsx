import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
import { InfoView } from "../atoms/InfoView";
import { GraphNode, Graph } from "../lib/graph-data/types";
import { removeSubGraph } from "../lib/graph-data/utils";
import { discoverNodes } from "../lib/openid-federation/trustChain";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { EntityItemsRenderer } from "./EntityItemRender";
import { useEffect, useState } from "react";
import { WarningModalAtom } from "./WarningModal";
import { showModal, fmtValidity } from "../lib/utils";

export interface ContextMenuProps {
  data: GraphNode;
  graph: Graph;
  onUpdate: (tree: Graph) => void;
  addToFailedList: (nodes: string[]) => void;
  isFailed: (node: string) => boolean;
}

export const NodeMenuAtom = ({
  data,
  graph,
  onUpdate,
  addToFailedList,
  isFailed,
}: ContextMenuProps) => {
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [discoveringList, setDiscoveringList] = useState<string[]>([]);
  const [discovering, setDiscovering] = useState(false);
  const [errorModalText, setErrorModalText] = useState(new Error());
  const [errorDetails, setErrorDetails] = useState<string[] | undefined>(
    undefined,
  );

  const addEntities = (entityID?: string | string[]) => {
    if (!entityID) setDiscoveringList(filteredItems);
    else {
      const list = Array.isArray(entityID) ? entityID : [entityID];
      const fiteredToDiscovery = list.filter(
        (node) => !isFailed(node) && !isDiscovered(node),
      );
      setDiscoveringList(fiteredToDiscovery);
    }
  };

  const removeEntities =
    (subordinate: boolean) => (entityIDs: string | string[]) => {
      const newGraph = Array.isArray(entityIDs)
        ? entityIDs.reduce(
            (acc, id) => removeSubGraph(acc, id, subordinate),
            graph,
          )
        : removeSubGraph(graph, entityIDs, subordinate);

      onUpdate(newGraph);
    };

  const removeSubordinates = removeEntities(true);
  const removeAuthorityHints = removeEntities(false);

  const isDiscovered = (dep: string) =>
    graph.nodes.find((node) => node.id === dep) ? true : false;

  const isInDiscovery = (dep: string) => discoveringList.includes(dep);

  const removeAllEntities =
    (subordinate: boolean = false) =>
    () => {
      if (subordinate) {
        removeSubordinates(
          data.info.immDependants.filter((dep) => isDiscovered(dep)),
        );
      } else {
        const authorityHints = data.info.ec.payload.authority_hints;

        if (!authorityHints) return;

        removeAuthorityHints(authorityHints.filter((dep) => isDiscovered(dep)));
      }
    };

  const removeAllSubordinates = removeAllEntities(true);
  const removeAllAuthorityHints = removeAllEntities(false);

  const onFilteredList = (items: string[]) => setFilteredItems(items);

  const immediateFilter = (anchor: string, filterValue: string) =>
    anchor.toLowerCase().includes(filterValue.toLowerCase());

  const handleDiscoveryResult = (result: {
    graph: Graph;
    failed: { entity: string; error: Error }[];
  }) => {
    onUpdate(result.graph);
    setDiscoveringList([]);
    setErrorDetails(undefined);

    if (result.failed.length === 0) return;

    console.error(`Failed to discover entities`, result.failed);

    addToFailedList(result.failed.map((f) => f.entity));
    setErrorModalText(
      new Error(`Failed to discover ${result.failed.length} entities`),
    );
    setErrorDetails(
      result.failed.map((f) => `${f.entity} - ${f.error.message}`),
    );
    showModal("error-modal");
  };

  const startDiscovery = () => {
    setDiscovering(true);

    discoverNodes(discoveringList, graph)
      .then(handleDiscoveryResult)
      .finally(() => setDiscovering(false));
  };

  useEffect(() => {
    if (discoveringList.length === 0) return;
    if (discoveringList.length === 1) {
      startDiscovery();
      return;
    }

    showModal("warning-modal");
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
      <WarningModalAtom
        modalID="error-modal"
        headerID="error_modal_title"
        details={errorDetails}
        description={errorModalText.message}
        dismissActionID="modal_cancel"
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
          {data.info.ec.payload.authority_hints &&
            data.info.ec.payload.authority_hints.length > 0 && (
              <AccordionAtom
                accordinId="hauthority-hints-list"
                labelId="authority_hints_list"
                hiddenElement={
                  <PaginatedListAtom
                    items={data.info.ec.payload.authority_hints}
                    itemsPerPage={5}
                    ItemsRenderer={EntityItemsRenderer({
                      discovering,
                      isDiscovered,
                      isInDiscovery,
                      addEntities,
                      removeEntity: removeAuthorityHints,
                      removeAllEntities: removeAllAuthorityHints,
                      isFailed,
                    })}
                    filterFn={immediateFilter}
                    onItemsFiltered={onFilteredList}
                  />
                }
              />
            )}
          {data.info.immDependants.length > 0 && (
            <AccordionAtom
              accordinId="immediate-subordinates-list"
              labelId="subordinate_list"
              hiddenElement={
                <PaginatedListAtom
                  items={data.info.immDependants}
                  itemsPerPage={5}
                  ItemsRenderer={EntityItemsRenderer({
                    discovering,
                    isDiscovered,
                    isInDiscovery,
                    addEntities,
                    removeEntity: removeSubordinates,
                    removeAllEntities: removeAllSubordinates,
                    isFailed,
                  })}
                  filterFn={immediateFilter}
                  onItemsFiltered={onFilteredList}
                />
              }
            />
          )}
          <AccordionAtom
            accordinId="entity-configuration"
            labelId="entity_configuration_data"
            hiddenElement={
              <JWTViewer
                raw={data.info.ec.jwt}
                decodedPayload={data.info.ec.payload as any}
                decodedHeader={data.info.ec.header as any}
              />
            }
          />
        </div>
      </div>
    </>
  );
};
