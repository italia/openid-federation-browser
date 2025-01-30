import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
import { InfoView } from "../atoms/InfoView";
import { GraphNode, Graph } from "../lib/graph-data/types";
import { genEdge } from "../lib/graph-data/utils";
import { discoverNodes } from "../lib/openid-federation/trustChain";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { EntityItemsRenderer } from "./EntityItemRender";
import { useEffect, useState } from "react";
import { WarningModalAtom } from "./WarningModal";
import { showModal, fmtValidity } from "../lib/utils";
import { validateEntityConfiguration } from "../lib/openid-federation/schema";
import { FormattedMessage } from "react-intl";
import { timestampToLocaleString } from "../lib/utils";
import { SubAdvanceFiltersAtom } from "./SubAdvanceFilters";

import {
  isDiscovered as _isDiscovered,
  removeEntities as _removeEntities,
  areDisconnected,
} from "../lib/graph-data/utils";

import style from "../css/ContextMenu.module.css";

export interface ContextMenuProps {
  data: GraphNode;
  graph: Graph;
  onUpdate: (tree: Graph) => void;
  addToFailedList: (nodes: string[]) => void;
  isFailed: (node: string) => boolean;
  onSelection: (node: string) => void;
}

export const NodeMenuAtom = ({
  data,
  graph,
  onUpdate,
  addToFailedList,
  isFailed,
  onSelection,
}: ContextMenuProps) => {
  const federationListEndpoint =
    data.info.ec.payload.metadata?.federation_entity?.federation_list_endpoint;

  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [toDiscoverList, setToDiscoverList] = useState<string[]>([]);
  const [errorModalText, setErrorModalText] = useState(new Error());
  const [filterDiscovered, setFilterDiscovered] = useState(false);
  const [immDependants, setImmDependants] = useState(
    data.info.immDependants || [],
  );
  const [errorDetails, setErrorDetails] = useState<string[] | undefined>(
    undefined,
  );
  const [discoveryQueue, setDiscoveryQueue] = useState<string[]>([]);
  const [advancedParams, setAdvancedParams] = useState<boolean>(false);

  const isDisconnected = (node: string) =>
    areDisconnected(graph, data.id, node);
  const isDiscovered = (node: string) => _isDiscovered(graph, node);
  const removeEntities = (entityID: string | string[]) =>
    onUpdate(_removeEntities(graph, entityID));

  const addEntities = (entityID?: string | string[]) => {
    if (!entityID) setToDiscoverList(filteredItems);
    else {
      const list = Array.isArray(entityID) ? entityID : [entityID];
      const fiteredToDiscovery = list.filter(
        (node) => !isFailed(node) && !isDiscovered(node),
      );
      setToDiscoverList(fiteredToDiscovery);
    }
  };

  const removeAllEntities =
    (subordinate: boolean = false) =>
    () => {
      if (subordinate) {
        removeEntities(
          data.info.immDependants.filter((dep) => isDiscovered(dep)),
        );
      } else {
        const authorityHints = data.info.ec.payload.authority_hints;

        if (!authorityHints) return;

        removeEntities(authorityHints.filter((dep) => isDiscovered(dep)));
      }
    };

  const removeAllSubordinates = removeAllEntities(true);
  const removeAllAuthorityHints = removeAllEntities(false);

  const onFilteredList = (items: string[]) => setFilteredItems(items);

  const immediateFilter = (anchor: string, filterValue: string) =>
    anchor.toLowerCase().includes(filterValue.toLowerCase());

  const showModalError = (error: Error, details?: string[]) => {
    setErrorModalText(error);
    setErrorDetails(details);
    showModal("error-modal");
  };

  const handleDiscoveryResult = async (result: {
    graph: Graph;
    failed: { entity: string; error: Error }[];
  }) => {
    if (result.failed.length !== 0) {
      addToFailedList(result.failed.map((f) => f.entity));

      showModalError(
        new Error(`Failed to discover ${result.failed.length} entities`),
        result.failed.map((f) => `${f.entity} - ${f.error.message}`),
      );
    }

    onUpdate(result.graph);
    setToDiscoverList([]);
  };

  const addEdge = (nodeId: string) => {
    const nodeData = graph.nodes.find(
      (node) => node.id.startsWith(nodeId) || nodeId.startsWith(node.id),
    );

    if (!nodeData) return;

    const isAuthorityHint = nodeData.info.ec.payload.authority_hints?.some(
      (ah) => ah.startsWith(data.id) || data.id.startsWith(ah),
    );

    const newGraph = {
      nodes: graph.nodes,
      edges: [
        ...graph.edges,
        !isAuthorityHint
          ? genEdge(nodeData.info, data.info)
          : genEdge(data.info, nodeData.info),
      ],
    };

    onUpdate(newGraph);
  };

  useEffect(() => {
    if (toDiscoverList.length === 0) return;
    if (toDiscoverList.length === 1) {
      setDiscoveryQueue([...discoveryQueue, ...toDiscoverList]);
      return;
    }
    showModal("warning-modal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toDiscoverList]);

  useEffect(() => {
    if (discoveryQueue.length === 0) return;
    const [discovery, ...rest] = discoveryQueue;
    discoverNodes([discovery], graph)
      .then((result) => {

        if(result.failed.find((f) => f.entity === discovery)) {
          return { graph: result.graph, failed: result.failed };
        }

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
        return { graph: newGraph, failed: result.failed };
      })
      .then(handleDiscoveryResult)
      .then(() => setDiscoveryQueue(rest));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoveryQueue]);

  useEffect(() => {
    setImmDependants(
      filterDiscovered
        ? data.info.immDependants.filter((dep) => !isDiscovered(dep))
        : data.info.immDependants,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDiscovered]);

  const displayedInfo = [
    ["entity_id_label", data.info.ec.entity],
    ["federation_entity_type_label", data.info.type],
    ["immediate_subordinate_count_label", data.info.immDependants.length],
    [
      "status_label",
      fmtValidity(data.info.ec.valid, data.info.ec.invalidReason),
    ],
    ["expiring_date_label", timestampToLocaleString(data.info.ec.payload.exp)],
  ];

  return (
    <>
      <WarningModalAtom
        modalID="warning-modal"
        headerID="warning_modal_title"
        descriptionID="warning_modal_message"
        dismissActionID="modal_cancel"
        acceptActionID="modal_confirm"
        onAccept={() =>
          setDiscoveryQueue([...discoveryQueue, ...toDiscoverList])
        }
        onDismiss={() => setToDiscoverList([])}
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
                      isDiscovered,
                      discoveringList: discoveryQueue,
                      addEntities,
                      removeEntity: removeEntities,
                      removeAllEntities: removeAllAuthorityHints,
                      isFailed,
                      onSelection,
                      isDisconnected,
                      addEdge,
                    })}
                    filterFn={immediateFilter}
                    onItemsFiltered={onFilteredList}
                  />
                }
              />
            )}
          {immDependants.length > 0 && (
            <AccordionAtom
              accordinId="immediate-subordinates-list"
              labelId="subordinate_list"
              hiddenElement={
                <>
                  <div style={{ width: "100%", paddingLeft: "8px" }}>
                    <div className="toggles">
                      <label
                        htmlFor="filteredToggle"
                        className={style.contextAccordinText}
                      >
                        <FormattedMessage id="filter_discovered" />
                        <input
                          type="checkbox"
                          id="filteredToggle"
                          onChange={() =>
                            setFilterDiscovered(!filterDiscovered)
                          }
                        />
                        <span className="lever"></span>
                      </label>
                    </div>

                    <div className={`${style.contextAccordinText}`}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={(e) => setAdvancedParams(e.target.checked)}
                        id="intermediate"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="intermediate"
                        style={{ padding: "0 0.75rem" }}
                      >
                        <FormattedMessage id="advanced_filters" />
                      </label>
                    </div>

                    {advancedParams && (
                      <SubAdvanceFiltersAtom
                        id="subordinate-advance-search"
                        subordinateUrl={federationListEndpoint || ""}
                        originalList={data.info.immDependants}
                        onListChange={setImmDependants}
                        showModalError={showModalError}
                      />
                    )}
                  </div>
                  <PaginatedListAtom
                    items={immDependants}
                    itemsPerPage={5}
                    ItemsRenderer={EntityItemsRenderer({
                      isDiscovered,
                      discoveringList: discoveryQueue,
                      addEntities,
                      removeEntity: removeEntities,
                      removeAllEntities: removeAllSubordinates,
                      isFailed,
                      onSelection,
                      isDisconnected,
                      addEdge,
                    })}
                    filterFn={immediateFilter}
                    onItemsFiltered={onFilteredList}
                  />
                </>
              }
            />
          )}
          <AccordionAtom
            accordinId="entity-configuration"
            labelId="entity_configuration_data"
            hiddenElement={
              <JWTViewer
                id="entity-configuration-view"
                raw={data.info.ec.jwt}
                decodedPayload={data.info.ec.payload as any}
                decodedHeader={data.info.ec.header as any}
                validationFn={validateEntityConfiguration}
                schemaUrl={import.meta.env.VITE_ENTITY_CONFIG_SCHEMA}
              />
            }
          />
          {data.info.trustMarks && (
            <AccordionAtom
              accordinId="trust-marks"
              labelId="trust_marks"
              hiddenElement={
                <>
                  {data.info.trustMarks.map((tm, i) => (
                    <div key={i} style={{ padding: "12px 12px" }}>
                      <AccordionAtom
                        key={i}
                        accordinId={`trust-mark-${i}`}
                        label={tm.id}
                        hiddenElement={
                          <JWTViewer
                            id={`trust-mark-${i}-view`}
                            raw={tm.jwt}
                            decodedPayload={tm.payload as any}
                            decodedHeader={tm.header as any}
                          />
                        }
                      />
                    </div>
                  ))}
                </>
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
