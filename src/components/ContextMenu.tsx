import sprite from "../assets/sprite.svg"; 
import { IntlProvider } from "react-intl";
import { translations } from "../lib/translations";
import { AccordionAtom } from "../atoms/Accordion";
import { discoverChild } from "../lib/openid-federation/trustChain";
import { Tree } from "@easygrating/easytree";
import { NodeInfo } from "../lib/openid-federation/types";
import { getTreeRoot } from "../lib/openid-federation/utils";
import { PaginatedListAtom } from "../atoms/PaginatedList";
import { ECViewer } from "../atoms/ECViewer";
import { InfoView } from "../atoms/InfoView";

export interface ContextMenuProps {
    data: any;
    onClose: () => void;
    onUpdate: (tree: Tree<NodeInfo>) => void;
    onError: (error: Error) => void;
};

export const ContextMenuComponent = ({data, onClose, onUpdate, onError}: ContextMenuProps) => {

    const discoverSubordinate = (entityID: string) => {
        const parent = data.info.tree;
    
        discoverChild(entityID, parent).then(tree => {
            const root = getTreeRoot(tree); 
            root.addChildAt(tree, parent.id)
            onUpdate(root);
        }).catch(onError);
        
        return undefined;
    };

    const ItemsRenderer = (discoverSubordinate: Function) => ({ items }: { items: any[] }) => {
        return (
            <>
            {items && items.map(
                (dep) => 
                    <li key={dep} className="it-list-item row pt-2" style={{width: "100rem"}}>
                        <div className='col-6'>{dep}</div>
                        <div className='col-1'>
                            <a className="btn btn-primary btn-icon btn-sm" title="Discovery" aria-label="Discovery" onClick={() => discoverSubordinate(dep)}>
                                <span className="d-none d-lg-block"><small style={{whiteSpace: "nowrap"}}>Discovery</small></span>
                            </a>
                        </div> 
                    </li>
                )}
            </>
        );
    }
    
    const immediateFilter = (anchor: string, filterValue: string) => anchor.toLowerCase().includes(filterValue.toLowerCase());

    const InitializedRenderer = ItemsRenderer(discoverSubordinate);

    return (
        <IntlProvider
            locale={navigator.language}
            defaultLocale="en-EN"
            messages={translations[navigator.language]}
        >
            <div className="container" style={{background: 'white', borderStyle: "solid", borderColor: "CornflowerBlue", alignItems: "left", justifyContent: "left", width: "100rem", height: "auto"}}>
                <div className="row primary-bg">
                    <div className="col-1">
                        <a className="btn-primary btn-icon icon-sm" onClick={onClose}>
                            <span className="rounded-icon">
                                <svg className="icon icon-primary">
                                    <use xlinkHref={sprite + "#it-close"}></use>
                                </svg>
                            </span>
                        </a>
                    </div>
                    <div className="col-11">
                        <small style={{color: "white", whiteSpace: "nowrap"}}>Entity ID: {data.label}</small>
                    </div>
                </div>
                <div className="row">
                    <div className="accordion" id="collapseExample">
                        <AccordionAtom accordinId="info-details" labelId="node_info"  hiddenElement={<InfoView data={data} />} />
                        <AccordionAtom accordinId="immediate-subordinates-list" labelId="subordinate_list" hiddenElement={
                            data.info.tree.data.immDependants.length === 0 ? <div className="container"><div className="row"><div className="col"><h6>No immediate subordinates</h6></div></div></div> :
                            <PaginatedListAtom items={data.info.tree.data.immDependants} itemsPerPage={5} ItemsRenderer={InitializedRenderer} filterFn={immediateFilter} />
                        } />
                        <AccordionAtom accordinId="entity-configuration" labelId="entity_configuration_data" hiddenElement={
                            <ECViewer raw={data.info.tree.data.ec.jwt} decoded={data.info.tree.data.ec.payload} />
                        } />
                    </div>
                </div>
            </div>
        </IntlProvider>
    );
};