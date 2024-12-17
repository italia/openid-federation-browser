import { GraphEdge } from "../lib/grap-data/types";
import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";

export interface EdgeMenuAtomProps {
    data: GraphEdge;
}

export const EdgeMenuAtom = ({data}: EdgeMenuAtomProps) => {
    return (
        <div className="row">
            <div className="accordion">
                {
                    data.subStatement &&
                    <AccordionAtom 
                        accordinId="subordinate-statement" 
                        labelId="entity_configuration_data" 
                        hiddenElement={
                            <JWTViewer 
                                id="edge-viewer" 
                                raw={data.subStatement.jwt} 
                                decoded={data.subStatement.payload as any} />
                        } 
                    />
                }
            </div>
        </div>
    )
}