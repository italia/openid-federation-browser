import { IntlProvider } from "react-intl";
import { translations } from "../lib/translations";
import { Tree } from "@easygrating/easytree";
import { NodeInfo } from "../lib/openid-federation/types";
import { Node as GraphNode } from "../lib/grap-data/types";
import { isNode } from "../lib/grap-data/utils";
import { NodeMenuAtom } from "../atoms/NodeMenu";
import { FormattedMessage } from 'react-intl';
import { RoundedIconAtom } from "../atoms/RoundedIcon";

export interface ContextMenuProps {
    data: GraphNode;
    onClose: () => void;
    onUpdate: (tree: Tree<NodeInfo>) => void;
    onError: (error: Error) => void;
};

export const ContextMenuComponent = ({data, onClose, onUpdate, onError}: ContextMenuProps) => {

    const nodeCheck = isNode(data);

    return (
        <IntlProvider
            locale={navigator.language}
            defaultLocale="en-EN"
            messages={translations[navigator.language]}
        >
            <div className="container" style={{background: 'white', borderStyle: "solid", borderColor: "CornflowerBlue", alignItems: "left", justifyContent: "left", width: "40rem", height: "auto"}}>
                <div className="row primary-bg">
                    <div className="col-1">
                        <button className="btn-primary btn-icon" onClick={onClose}>
                            <RoundedIconAtom iconID="#it-close" sizeClass="icon-sm" isPrimary={true} />
                        </button>
                    </div>
                    <div className="col-11">
                        <small style={{color: "white", whiteSpace: "nowrap", fontSize: "80%"}}><FormattedMessage id={nodeCheck ? 'entity_id_label' : 'connection_lael'} />: {data.label}</small>
                    </div>
                </div>
                { 
                    nodeCheck
                        ? <NodeMenuAtom data={data} onUpdate={onUpdate} onError={onError} />
                        :  <div/>
                }

            </div>
        </IntlProvider>
    );
};