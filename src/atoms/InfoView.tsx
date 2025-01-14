import { FormattedMessage } from "react-intl";
import style from "../css/ContextMenu.module.css";

export interface InfoViewProps {
  id: string;
  infos: (string | number)[][];
}

export const InfoView = ({ id, infos }: InfoViewProps) => {
  const toRow = (info: (string | number)[], index: number) => (
    <tr
      className={style.contextAccordinText}
      key={`${id}-info${index}`}
      style={{ border: "2px solid", borderColor: "hsl(0deg, 0%, 64%)" }}
    >
      <td style={{ border: "2px solid", whiteSpace: "nowrap", borderColor: "hsl(0deg, 0%, 64%)" }}>
        {<FormattedMessage id={info[0].toString()} />}
      </td>
      <td style={{ border: "2px solid", borderColor: "hsl(0deg, 0%, 64%)" }}>{info[1]}</td>
    </tr>
  );

  return (
    <div className="container" style={{ padding: "14px 24px" }}>
      <table
        className="table"
        style={{ borderCollapse: "collapse", border: "1px solid", borderColor: "hsl(0deg, 0%, 64%)"}}
      >
        <tbody>{infos.map(toRow)}</tbody>
      </table>
    </div>
  );
};
