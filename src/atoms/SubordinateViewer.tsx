import { SubordianteStatement } from "../lib/openid-federation/types";

export interface SubordinateViewerAtomProps {
    subordinate: SubordianteStatement;
}

export const SubordinateViewerAtom = ({subordinate}: SubordinateViewerAtomProps) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <textarea style={{overflowY: "scroll", resize: "none", width: "100%", height:"20rem"}} value={JSON.stringify(subordinate, null, 4)} readOnly></textarea>
                </div>
            </div>
        </div>
    )
};