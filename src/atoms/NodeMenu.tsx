import { AccordionAtom } from "./Accordion";
import { ECViewer } from "../atoms/ECViewer";
import { InfoView } from "../atoms/InfoView";
import { GraphNode, Graph } from "../lib/grap-data/types";
import { removeSubGraph } from "../lib/grap-data/utils";
import { discoverChild, discoverMultipleChildren } from "../lib/openid-federation/trustChain";
import { NoImmSubAtom } from "../atoms/NoImmSub";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { SubListItemsRenderer } from "./SubListItemRender";

export interface ContextMenuProps {
    data: GraphNode;
    graph: Graph;
    onUpdate: (tree: Graph) => void;
    onError: (error: Error) => void;
};

export const NodeMenuAtom = ({data, graph, onUpdate, onError}: ContextMenuProps) => {

    const addSubordinate = (entityID: string) =>
        discoverChild(entityID, data.info, graph).then(onUpdate).catch(onError);

    const addAllFilteredSubordinates = (items: string[]) =>
        discoverMultipleChildren(items, data.info, graph).then(onUpdate).catch(onError);

    const removeSubordinate = (entityID: string) => {
        const newGraph = removeSubGraph(graph, entityID);
        onUpdate(newGraph);
    };
    
    const immediateFilter = (anchor: string, filterValue: string) => anchor.toLowerCase().includes(filterValue.toLowerCase());

    return (
        <>
            <div className="row">
                <div className="accordion">
                    <AccordionAtom 
                        accordinId="info-details" 
                        labelId="node_info"  
                        hiddenElement={<InfoView data={data} />} 
                    />
                    <AccordionAtom 
                        accordinId="immediate-subordinates-list" 
                        labelId="subordinate_list" 
                        hiddenElement={
                            data.info.immDependants.length === 0 
                                ? <NoImmSubAtom /> 
                                : <PaginatedListAtom 
                                    items={data.info.immDependants} 
                                    itemsPerPage={5} 
                                    ItemsRenderer={
                                        SubListItemsRenderer(
                                            {
                                                graph, 
                                                addAllFilteredSubordinates, 
                                                addSubordinate, 
                                                removeSubordinate
                                            }
                                        )
                                    } 
                                    filterFn={immediateFilter} />
                        } 
                    />
                    <AccordionAtom 
                        accordinId="entity-configuration" 
                        labelId="entity_configuration_data" 
                        hiddenElement={
                            <ECViewer raw={data.info.ec.jwt} decoded={data.info.ec.payload as any} />
                        } 
                    />
                </div>
            </div>
        </>
    )
};