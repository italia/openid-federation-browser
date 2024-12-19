import { IntlProvider } from "react-intl";
import { translations } from "../lib/translations";
import { GraphEdge, GraphNode, Graph } from "../lib/grap-data/types";
import { isNode } from "../lib/grap-data/utils";
import { NodeMenuAtom } from "../atoms/NodeMenu";
import { EdgeMenuAtom } from "../atoms/EdgeMenu";
import { FormattedMessage } from 'react-intl';
import { IconAtom } from "../atoms/Icon";
import { useEffect } from "react";
import { handleKeyDwonEvent } from "../lib/utils";
import styles from '../css/ContextMenu.module.css';

export interface ContextMenuProps {
    data: GraphNode | GraphEdge;
    graph: Graph;
    onClose: () => void;
    onUpdate: (graph: Graph) => void;
    onError: (error: Error) => void;
};

export const ContextMenuComponent = ({data, graph, onClose, onUpdate, onError}: ContextMenuProps) => {
    const nodeCheck = isNode(data);
    
    useEffect(() => handleKeyDwonEvent('Escape', onClose), []);
    
    return (
        <IntlProvider
            locale={navigator.language}
            defaultLocale="en-EN"
            messages={translations[navigator.language]}
        >
            <div 
                className={`container ${styles.contextMenu}`}>
                <div className="row primary-bg pt-1 pb-1">
                    <div className="col-md-auto" style={{position: "relative", top: "-2px"}} onClick={onClose}>
                        <IconAtom iconID="#it-close" className="icon-sm icon-white" />
                    </div>
                    <div className={`col-md-auto ${styles.contextHeaderText}`}>
                        <FormattedMessage 
                            id={nodeCheck ? 'entity_id_label' : 'connection_lael'} />: {data.label}
                    </div>
                </div>
                { 
                    nodeCheck
                        ? <NodeMenuAtom data={data as GraphNode} graph={graph} onUpdate={onUpdate} onError={onError} />
                        :  <EdgeMenuAtom data={data as GraphEdge} />
                }

            </div>
        </IntlProvider>
    );
};