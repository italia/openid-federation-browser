import sprite from "../assets/sprite.svg"; 

export interface ContextMenuProps {
    data: any;
    onClose: () => void;
};

export const ContextMenuAtom = ({data, onClose}: ContextMenuProps) => {
    return (
        <div className="container" style={{background: 'white', borderStyle: "solid", borderColor: "CornflowerBlue"}}>
            <div className="row">
                <div className="col-10 float-right">
                    <a className="d-lg-block navbar-brand" onClick={onClose}><svg className="icon"><use xlinkHref={sprite + "#it-close"}></use></svg></a>
                </div>
            </div>
            <div className="row" style={{display: "inline"}}>
                <div className="col-10"style={{whiteSpace: "nowrap"}}>Entity ID: {data.label}</div>
            </div>
            <div className="row">Federation Entity Type: {data.info.type}</div>
            <div className="row">Immediate Subordinate Count: {data.info.dependantsLen}</div>
        </div>
    );
};