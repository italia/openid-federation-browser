import React from "react";
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

  const validateSub = async (ec: object): Promise<[boolean, string | undefined]> => {
    const validation = await validateSubordinateStatement(ec);
    return [(validation[0] && data.subStatement!.valid), validation[1]];
  }

  return (
    <div className="row justify-content-center">
        {data.subStatement ? (
          <div className="accordion">
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
                  decodedPayload={data.subStatement.payload as object}
                  decodedHeader={data.subStatement.header as object}
                  validationFn={validateSub}
                  schemaUrl={`${import.meta.env.VITE_SUB_STATEMENT_SCHEMA}`}
                />
              }
            />
          </div>
        ) : (
          <div className="col-md-10 text-center">
            <h6>No subordinate statement available</h6>
          </div>
        )
        }
      </div>
  );
};
