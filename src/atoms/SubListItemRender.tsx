import { IconAtom } from "./Icon";
import { Modal } from "bootstrap-italia";
import { WarningModalAtom } from "./WarningModal";
import { Graph } from "../lib/grap-data/types";

export interface SubListItemsRendererProps {
    graph: Graph;
    removeSubordinates: (dep: string | string[]) => void;
    addSubordinates: (dep: string | string[]) => void;
};

export const SubListItemsRenderer = ({ graph, removeSubordinates, addSubordinates }: SubListItemsRendererProps) => ({items}: {items: any[]}) => {
    const toggleModal = () => {
        const modal = new Modal(document.getElementById('warning-modal') as HTMLElement);
        modal.toggle();
    };

    const discovered = (dep: string) => graph.nodes.find(node => node.id === dep) ? true : false;
    const removeDiscovered = () => {
        const allDicovered = items.filter(dep => discovered(dep));
        removeSubordinates(allDicovered);
    };

    return (
        <>
            <WarningModalAtom 
                modalID="warning-modal" 
                headerID="warning_modal_title" 
                descriptionID="warning_modal_message" 
                acceptActionID="warning_modal_confirm" 
                dismissActionID="warning_modal_cancel" 
                onAccept={() => addSubordinates(items)}
            />
            <ul style={{listStyleType: "none"}}>
                {items && items.map(
                    (dep) => 
                        <li 
                            key={dep} 
                            className="it-list-item pt-2" 
                            style={{width: "auto", height: "auto"}}>
                            <div className="row justify-content-md-start">
                                <div className='col-md-auto'>
                                    {
                                        discovered(dep) ? 
                                        <button 
                                            className="btn btn-danger btn-icon btn-sm" 
                                            title="Remove" 
                                            aria-label="Remove" 
                                            onClick={() => removeSubordinates(dep)}>
                                            <IconAtom 
                                                iconID="#it-minus" 
                                                className="icon-xs icon-white" 
                                                isRounded={false}
                                            />
                                        </button> :
                                        <button 
                                            className="btn btn-success btn-icon btn-sm" 
                                            title="Add" 
                                            aria-label="Add" 
                                            onClick={() => addSubordinates(dep)}>
                                            <IconAtom 
                                                iconID="#it-plus" 
                                                className="icon-xs icon-white" 
                                                isRounded={false}/>
                                        </button>
                                    }
                                </div>
                                <div className='col-md-auto'>
                                    <small style={{whiteSpace: "nowrap"}}>{dep}</small>
                                </div>
                            </div>
                        </li>
                    )}
            </ul>
            <div className="row justify-content-md-left">
                <div className="col-md-auto">
                    <button 
                        className="btn btn-primary btn-icon" 
                        title="Discovery" 
                        aria-label="Discovery" 
                        onClick={toggleModal}>
                        <IconAtom 
                            iconID="#it-plus" 
                            className="icon-xs icon-white" 
                            isRounded={false}/>
                        <span style={{fontSize: "60%"}}>Add all filtered</span>
                    </button>
                </div>
                <div className="col-md-auto">
                    <button 
                        className="btn btn-warning btn-icon" 
                        title="Discovery" 
                        aria-label="Discovery" 
                        onClick={removeDiscovered}>
                        <IconAtom 
                            iconID="#it-restore" 
                            className="icon-xs icon-white" 
                            isRounded={false}/>
                        <span style={{fontSize: "60%"}}>Remove All Subordinate</span>
                    </button>
                </div>
            </div>
        </>
    );
};