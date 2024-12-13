import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
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

    const addSubordinates = (entityIDs: string | string[]) =>{
        const newGraph = 
            Array.isArray(entityIDs) 
                ? discoverMultipleChildren(entityIDs, data.info, graph)
                : discoverChild(entityIDs, data.info, graph);

        newGraph.then(onUpdate).catch(onError);
    };

    const removeSubordinates = (entityIDs: string | string[]) => {
        const newGraph = 
            Array.isArray(entityIDs) 
                ? entityIDs.reduce((acc, id) => removeSubGraph(acc, id), graph)
                : removeSubGraph(graph, entityIDs);

        onUpdate(newGraph);
    };
    
    const immediateFilter = (anchor: string, filterValue: string) => 
        anchor
            .toLowerCase()
            .includes(filterValue.toLowerCase());

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
                                                addSubordinates, 
                                                removeSubordinates
                                            }
                                        )
                                    } 
                                    filterFn={immediateFilter} />
                        } 
                    />
                    <AccordionAtom 
                        accordinId="entity-configuration" 
                        labelId="subordinate_statement_data" 
                        hiddenElement={
                            <JWTViewer id="node-viewer" 
                                raw={data.info.ec.jwt} 
                                decoded={data.info.ec.payload as any} />
                        } 
                    />
                </div>
            </div>
        </>
    )
};