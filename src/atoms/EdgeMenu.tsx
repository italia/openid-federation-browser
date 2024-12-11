import { GraphEdge } from "../lib/grap-data/types";
import { AccordionAtom } from "./Accordion";
import { SubordinateViewerAtom } from "./SubordinateViewer";

export interface EdgeMenuAtomProps {
    data: GraphEdge;
}

export const EdgeMenuAtom = ({data}: EdgeMenuAtomProps) => {
    return (
        <div className="row">
            <div className="accordion">
                {
                    data.subStatement &&
                    <AccordionAtom accordinId="subordinate-configuration" labelId="subordinate_statement_data" hiddenElement={
                        <SubordinateViewerAtom subordinate={data.subStatement} />
                    } />
                }
            </div>
        </div>
    )
}