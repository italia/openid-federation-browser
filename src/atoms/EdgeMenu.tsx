import { GraphEdge } from "../lib/grap-data/types";
import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
import { fmtValidity } from "../lib/utils";
import { InfoView } from "./InfoView";

export interface EdgeMenuAtomProps {
  data: GraphEdge;
}

export const EdgeMenuAtom = ({ data }: EdgeMenuAtomProps) => {
  return (
    <div className="row">
      <div className="accordion">
        {data.subStatement && (
          <>
            <AccordionAtom
              accordinId="info-details"
              labelId="node_info"
              hiddenElement={
                <InfoView
                  id={`${data.label}-view`}
                  infos={[
                    [
                      "status_label",
                      fmtValidity(
                        data.subStatement.valid,
                        data.subStatement.invalidReason,
                      ),
                    ],
                    [
                      "expiring_date_label",
                      new Date(
                        data.subStatement.payload.exp * 1000,
                      ).toLocaleString(),
                    ],
                  ]}
                />
              }
            />
            <AccordionAtom
              accordinId="subordinate-statement"
              labelId="entity_configuration_data"
              hiddenElement={
                <JWTViewer
                  id="edge-viewer"
                  raw={data.subStatement.jwt}
                  decoded={data.subStatement.payload as any}
                />
              }
            />
          </>
        )}
      </div>
    </div>
  );
};
