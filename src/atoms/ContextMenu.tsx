import sprite from "../assets/sprite.svg"; 

export interface ContextMenuProps {
    data: any;
    onClose: () => void;
};

export const ContextMenuAtom = ({data, onClose}: ContextMenuProps) => {
    return (
        <div className="modal-dialog modal-lg" style={{background: 'white', width: "420px", borderStyle: "solid", borderColor: "CornflowerBlue" }}>
            <div className="modal-content" role="document">
                <div className="modal-header">
                    <div style={{width: "3rem"}}>Entity ID: {data.label}</div>
                    <button className="btn-close" type="button" onClick={onClose}>
                        <svg className="icon"><use xlinkHref={sprite + "#it-close"}></use></svg>
                    </button>
                </div>
                <div className="modal-body">
                    <div>Fderation Entity Type: {data.info.type}</div>
                    <div>Immediate Subordinate Count: {data.info.dependantsLen}</div>
                </div>
            </div>
        </div>
    );
};