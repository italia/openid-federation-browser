import React from "react";
import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
import { InfoView } from "../atoms/InfoView";
import { GraphNode } from "../lib/graph-data/types";
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
import { getEntityTypes } from "../lib/openid-federation/utils";
import style from "../css/ContextMenu.module.css";

export interface ContextMenuProps {
  data: GraphNode;
  onNodesAdd: (nodes: string[]) => void;
  onNodesRemove: (nodes: string[]) => void;
  onEdgeAdd: (node: string) => void;
  isInDiscoveryQueue: (dep: string) => boolean;
  isDiscovered: (node: string) => boolean;
  isFailed: (node: string) => boolean;
  isDisconnected: (node: string) => boolean;
  onSelection: (node: string) => void;
  onModalError: (message?: string[]) => void;
}

export const NodeMenuAtom = ({
  data,
  onNodesAdd,
  onNodesRemove,
  onEdgeAdd,
  isInDiscoveryQueue,
  isDiscovered,
  isFailed,
  isDisconnected,
  onSelection,
  onModalError,
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

  const removeEntities = (entityIDs: string[]) => onNodesRemove(entityIDs);

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
    ["entity_type_label", getEntityTypes(data.info.ec.payload).join(", ")],
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
            show={true}
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
                      isDiscovered,
                      onEdgeAdd: (node: string) => onEdgeAdd(node),
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
                        showModalError={onModalError}
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
                      isDiscovered,
                      onEdgeAdd: (node: string) => onEdgeAdd(node),
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
                  onModalError={onModalError}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
