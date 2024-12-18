import { FormattedMessage } from 'react-intl';
import { GraphNode } from '../lib/grap-data/types';
import style from '../css/ContextMenu.module.css';

export interface InfoViewProps {
    data: GraphNode;
};

export const InfoView = ({data}: InfoViewProps) => {
    const fmtValidity = (valid: boolean, reason: string | undefined) => {
        const value = valid ? "valid" : "invalid";
        return valid ? value : `${value} (${reason})`;
    };

    const displayedInfo = [
        [<FormattedMessage id="federation_entity_type_label" /> , data.info.type],
        [<FormattedMessage id="immediate_subordinate_count_label" />, data.info.immDependants.length],
        [<FormattedMessage id="status_label" />,  fmtValidity(data.info.ec.valid, data.info.ec.invalidReason)],
        [<FormattedMessage id="expiring_date_label" />, new Date(data.info.ec.payload.exp * 1000).toISOString()],
    ];

    const toRow = (info: (number | JSX.Element)[] | (string | JSX.Element)[], index: number) => 
        <tr className={style.contextAccordinText} key={`${data.info.ec.entity}-info${index}`} style={{border: "1px solid"}}>
            <td style={{border: "1px solid", whiteSpace: "nowrap"}}>{info[0]}</td>
            <td style={{border: "1px solid"}}>{info[1]}</td>
        </tr>;

    return (
        <div className="container" style={{padding: "14px 24px"}}>
            <table className="table" style={{borderCollapse: "collapse", border: "1px solid"}}>
                <tbody>
                    {displayedInfo.map(toRow)}
                </tbody>
            </table>
        </div>
    );
};