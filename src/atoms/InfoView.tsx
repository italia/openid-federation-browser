import React, { JSX } from "react";
import { FormattedMessage } from "react-intl";
import style from "../css/ContextMenu.module.css";

export interface InfoViewProps {
  id: string;
  infos: (string | number | JSX.Element)[][];
}

export const InfoView = ({ id, infos }: InfoViewProps) => {
  const toRow = (info: (string | number | JSX.Element)[], index: number) => (
    <tr className={style.contextAccordinText} key={`${id}-info${index}`}>
      <td
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {<FormattedMessage id={info[0].toString()} />}
      </td>
      <td>{info[1]}</td>
    </tr>
  );

  return (
    <div className="container" style={{ padding: "14px 24px" }}>
      <table className="table">
        <tbody>{infos.map(toRow)}</tbody>
      </table>
    </div>
  );
};
