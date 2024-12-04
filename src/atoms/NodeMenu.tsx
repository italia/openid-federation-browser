import { AccordionAtom } from "./Accordion";
import { ECViewer } from "../atoms/ECViewer";
import { InfoView } from "../atoms/InfoView";
import { Tree } from "@easygrating/easytree";
import { NodeInfo } from "../lib/openid-federation/types";
import { Node as GraphNode } from "../lib/grap-data/types";
import { discoverChild } from "../lib/openid-federation/trustChain";
import { getTreeRoot } from "../lib/openid-federation/utils";
import { NoImmSubAtom } from "../atoms/NoImmSub";
import { PaginatedListAtom } from "../atoms/PaginatedList";

export interface ContextMenuProps {
    data: GraphNode;
    onUpdate: (tree: Tree<NodeInfo>) => void;
    onError: (error: Error) => void;
};

export const NodeMenuAtom = ({data, onUpdate, onError}: ContextMenuProps) => {

    const discoverSubordinate = (entityID: string) => {
        const parent = data.info.tree;
    
        discoverChild(entityID, parent).then(tree => {
            const root = getTreeRoot(tree); 
            root.addChildAt(tree, parent.id)
            onUpdate(root);
        }).catch(onError);
        
        return undefined;
    };

    const ItemsRenderer = (discoverSubordinate: Function, tree: Tree<NodeInfo>) => ({ items }: { items: any[] }) => {
        const notDiscovered = (dep: string) => tree.children.find(child => child.id === dep) ? true : false;

        return (
            <>
            {items && items.map(
                (dep) => 
                    <li key={dep} className="it-list-item pt-2" style={{width: "auto", height: "auto"}}>
                        <div className="row justify-content-md-start">
                            <div className='col-md-10'><small style={{whiteSpace: "nowrap"}}>{dep}</small></div>
                            <div className='col-md-2'>
                                <button className="btn btn-primary btn-icon" style={{padding: "10% 24%"}} title="Discovery" aria-label="Discovery" onClick={() => discoverSubordinate(dep)} disabled={notDiscovered(dep)}>
                                    <span style={{fontSize: "60%"}}>Discovery</span>
                                </button>
                            </div>
                        </div>
                    </li>
                )}
            </>
        );
    }
    
    const immediateFilter = (anchor: string, filterValue: string) => anchor.toLowerCase().includes(filterValue.toLowerCase());

    const InitializedRenderer = ItemsRenderer(discoverSubordinate, data.info.tree);

    return (
        <div className="row">
            <div className="accordion" id="collapseExample">
                <AccordionAtom accordinId="info-details" labelId="node_info"  hiddenElement={<InfoView data={data} />} />
                <AccordionAtom accordinId="immediate-subordinates-list" labelId="subordinate_list" hiddenElement={
                    data.info.tree.data.immDependants.length === 0 
                        ? <NoImmSubAtom /> 
                        : <PaginatedListAtom items={data.info.tree.data.immDependants} itemsPerPage={5} ItemsRenderer={InitializedRenderer} filterFn={immediateFilter} />
                } />
                <AccordionAtom accordinId="entity-configuration" labelId="entity_configuration_data" hiddenElement={
                    <ECViewer raw={data.info.tree.data.ec.jwt} decoded={data.info.tree.data.ec.payload as any} />
                } />
            </div>
        </div>
    )
};