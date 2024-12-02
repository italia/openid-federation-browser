import sprite from "../assets/sprite.svg"; 
import { IntlProvider } from "react-intl";
import { translations } from "../lib/translations";
import { AccordionAtom } from "./Accordion";
import { SubordinateListAtom } from "./SubordinateList";
import { discoverChild } from "../lib/openid-federation/trustChain";
import { Tree } from "@easygrating/easytree";
import { NodeInfo } from "../lib/openid-federation/types";
import { getTreeRoot } from "../lib/openid-federation/utils";

export interface ContextMenuProps {
    data: any;
    onClose: () => void;
    onUpdate: (tree: Tree<NodeInfo>) => void;
    onError: (error: Error) => void;
};

export const ContextMenuAtom = ({data, onClose, onUpdate, onError}: ContextMenuProps) => {

    const discoverSubordinate = (entityID: string) => {
        const parent = data.info.tree;
    
        discoverChild(entityID, parent).then(tree => {
            const root = getTreeRoot(tree); 
            root.addChildAt(tree, parent.id)
            onUpdate(root);
        }).catch(onError);
        
        return undefined;
    };

    return (
        <IntlProvider
            locale={navigator.language}
            defaultLocale="en-EN"
            messages={translations[navigator.language]}
        >
        <div className="container" style={{background: 'white', borderStyle: "solid", borderColor: "CornflowerBlue", alignItems: "left", justifyContent: "left", width: "100rem"}}>
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
                    <div className="accordion">
                        <AccordionAtom accordinId="info-details" labelId="node_info"  hiddenElement={
                            <div>
                                <div className="row">Federation Entity Type: {data.info.type}</div>
                                <div className="row">Immediate Subordinate Count: {data.info.dependantsLen}</div>
                            </div>
                        } />
                    </div>
                    <AccordionAtom accordinId="immediate-subordinates-list" labelId="subordinate_list" hiddenElement={
                        <SubordinateListAtom list={data.info.tree.data.immDependants} discoverSubordinate={discoverSubordinate} />
                    } />
                </div>
            </div>
        </div>
        </IntlProvider>
    );
};