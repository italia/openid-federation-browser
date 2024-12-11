import { IconAtom } from "./Icon";
import { Modal } from "bootstrap-italia";
import { WarningModalAtom } from "./WarningModal";
import { Graph } from "../lib/grap-data/types";

export interface SubListItemsRendererProps {
    graph: Graph;
    addAllFilteredSubordinates: (items: string[]) => void;
    removeSubordinate: (dep: string) => void;
    addSubordinate: (dep: string) => void;
};

export const SubListItemsRenderer = ({ graph, addAllFilteredSubordinates, removeSubordinate, addSubordinate }: SubListItemsRendererProps) => ({items}: {items: any[]}) => {
    const toggleModal = () => {
        const modal = new Modal(document.getElementById('warning-modal') as HTMLElement);
        modal.toggle();
    };

    const notDiscovered = (dep: string) => graph.nodes.find(node => node.id === dep) ? false : true;

    return (
        <>  
            <WarningModalAtom 
                modalID="warning-modal" 
                headerID="warning_modal_title" 
                descriptionID="warning_modal_message" 
                acceptActionID="warning_modal_confirm" 
                denyActionID="warning_modal_cancel" 
                onAccept={() => addAllFilteredSubordinates(items)}
            />
            <ul>
            <div className="row justify-content-md-end">
                <div className="col-md-auto">
                    <button 
                        className="btn btn-primary btn-icon" 
                        style={{padding: "10% 26%"}} 
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
            </div>
            {items && items.map(
                (dep) => 
                    <li key={dep} className="it-list-item pt-2" style={{width: "auto", height: "auto"}}>
                        <div className="row justify-content-md-start">
                            <div className='col-md-10'><small style={{whiteSpace: "nowrap"}}>{dep}</small></div>
                            <div className='col-md-2'>
                                {
                                    !notDiscovered(dep) ? 
                                    <button 
                                        className="btn btn-danger btn-icon" 
                                        style={{padding: "10% 24%"}} 
                                        title="Remove" 
                                        aria-label="Remove" 
                                        onClick={() => removeSubordinate(dep)}>
                                        <IconAtom 
                                            iconID="#it-minus" 
                                            className="icon-xs icon-white" 
                                            isRounded={false}
                                        />
                                        <span style={{fontSize: "60%"}}>Remove</span>
                                    </button> :
                                    <button 
                                        className="btn btn-success btn-icon" 
                                        style={{padding: "10% 24%"}} 
                                        title="Discovery" 
                                        aria-label="Discovery" 
                                        onClick={() => addSubordinate(dep)}>
                                        <IconAtom 
                                            iconID="#it-plus" 
                                            className="icon-xs icon-white" 
                                            isRounded={false}/>
                                        <span style={{fontSize: "60%"}}>Add</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </>
    );
};