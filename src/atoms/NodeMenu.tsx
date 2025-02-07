import React from "react";
import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
import { InfoView } from "../atoms/InfoView";
import { GraphNode, Graph } from "../lib/graph-data/types";
import { genEdge } from "../lib/graph-data/utils";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { EntityItemsRenderer } from "./EntityItemRender";
import { useEffect, useState } from "react";
import { WarningModalAtom } from "./WarningModal";
import { showModal, fmtValidity } from "../lib/utils";
import { validateEntityConfiguration } from "../lib/openid-federation/schema";
import { FormattedMessage } from "react-intl";
import { timestampToLocaleString } from "../lib/utils";
import { SubAdvanceFiltersAtom } from "./SubAdvanceFilters";
import { TrustMarkListing } from "./TrustMarkListing";

import { areDisconnected } from "../lib/graph-data/utils";

import style from "../css/ContextMenu.module.css";

export interface ContextMenuProps {
  data: GraphNode;
  graph: Graph;
  onNodesAdd: (nodes: string[]) => void;
  onNodesRemove: (nodes: string[]) => void;
  isInDiscoveryQueue: (dep: string) => boolean;
  isFailed: (node: string) => boolean;
  onSelection: (node: string) => void;
}

export const NodeMenuAtom = ({
  data,
  graph,
  onNodesAdd,
  onNodesRemove,
  isInDiscoveryQueue,
  isFailed,
  onSelection,
}: ContextMenuProps) => {
  const federationListEndpoint =
    data.info.ec.payload.metadata?.federation_entity?.federation_list_endpoint;

  const trustMarkListEndpoint =
    data.info.ec.payload.metadata?.federation_entity
      .federation_trust_mark_list_endpoint;

  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [toDiscoverList, setToDiscoverList] = useState<string[]>([]);
  const [filterDiscovered, setFilterDiscovered] = useState(false);
  const [immDependants, setImmDependants] = useState(
    data.info.immDependants || [],
  );
  const [advancedParams, setAdvancedParams] = useState<boolean>(false);

  const isDisconnected = (node: string) =>
    areDisconnected(graph, data.id, node);
  const removeEntities = (entityIDs: string[]) => onNodesRemove(entityIDs);

  const showModalError = (message: string[] | undefined) => {
    console.log(message);
  };

  const addEntities = (entityID?: string | string[]) => {
    if (!entityID) setToDiscoverList(filteredItems);
    else {
      const list = Array.isArray(entityID) ? entityID : [entityID];
      const fiteredToDiscovery = list.filter(
        (node) => !isFailed(node) && !isInDiscoveryQueue(node),
      );
      setToDiscoverList(fiteredToDiscovery);
    }
  };

  const removeAllEntities =
    (subordinate: boolean = false) =>
    () => {
      if (subordinate) {
        removeEntities(
          data.info.immDependants.filter((dep) => isInDiscoveryQueue(dep)),
        );
      } else {
        const authorityHints = data.info.ec.payload.authority_hints;

        if (!authorityHints) return;

        removeEntities(authorityHints.filter((dep) => isInDiscoveryQueue(dep)));
      }
    };

  const removeAllSubordinates = removeAllEntities(true);
  const removeAllAuthorityHints = removeAllEntities(false);

  const onFilteredList = (items: string[]) => setFilteredItems(items);

  const immediateFilter = (anchor: string, filterValue: string) =>
    anchor.toLowerCase().includes(filterValue.toLowerCase());

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

    console.log(newGraph);

    //onUpdate(newGraph);
  };

  useEffect(() => {
    if (toDiscoverList.length === 0) return;
    if (toDiscoverList.length === 1) {
      onNodesAdd(toDiscoverList);
      return;
    }
    showModal("warning-modal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toDiscoverList]);

  useEffect(() => {
    setImmDependants(
      filterDiscovered
        ? data.info.immDependants.filter((dep) => !isInDiscoveryQueue(dep))
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
        onAccept={() => onNodesAdd(toDiscoverList)}
        onDismiss={() => setToDiscoverList([])}
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
                      isInDiscoveryQueue,
                      addEntities,
                      onNodesRemove,
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
                      isInDiscoveryQueue,
                      addEntities,
                      onNodesRemove,
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
                decodedPayload={data.info.ec.payload as object}
                decodedHeader={data.info.ec.header as object}
                validationFn={validateEntityConfiguration}
                schemaUrl={`${import.meta.env.VITE_ENTITY_CONFIG_SCHEMA}`}
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
                            decodedPayload={tm.payload as object}
                            decodedHeader={tm.header as object}
                          />
                        }
                      />
                    </div>
                  ))}
                </>
              }
            />
          )}
          {trustMarkListEndpoint && (
            <AccordionAtom
              accordinId="trust-marks-list"
              labelId="trust_marks_listing_endpoint"
              hiddenElement={
                <TrustMarkListing
                  id="trust-mark-listing"
                  trustMarkListUrl={trustMarkListEndpoint}
                  showModalError={showModalError}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
