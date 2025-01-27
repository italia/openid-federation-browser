import { GraphEdge } from "../lib/graph-data/types";
import { AccordionAtom } from "./Accordion";
import { JWTViewer } from "./JWTViewer";
import { fmtValidity } from "../lib/utils";
import { InfoView } from "./InfoView";
import { timestampToLocaleString } from "../lib/utils";
import { validateSubordinateStatement } from "../lib/openid-federation/schema";

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
              labelId="edge_info"
              hiddenElement={
                <InfoView
                  id={`${data.label}-view`}
                  infos={[
                    ["source", data.source],
                    ["target", data.target],
                    [
                      "substatement_status_label",
                      fmtValidity(
                        data.subStatement.valid,
                        data.subStatement.invalidReason,
                      ),
                    ],
                    [
                      "expiring_date_label",
                      timestampToLocaleString(data.subStatement.payload.exp),
                    ],
                  ]}
                />
              }
            />
            <AccordionAtom
              accordinId="subordinate-statement"
              labelId="subordinate_statement_data"
              hiddenElement={
                <JWTViewer
                  id="subordinate-statement-viewer"
                  raw={data.subStatement.jwt}
                  decodedPayload={data.subStatement.payload as any}
                  decodedHeader={data.subStatement.header as any}
                  validationFn={validateSubordinateStatement}
                  schemaUrl={process.env.REACT_APP_SUB_STATEMENT_SCHEMA}
                />
              }
            />
          </>
        )}
      </div>
    </div>
  );
};
