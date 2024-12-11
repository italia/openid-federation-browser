import { FormattedMessage } from 'react-intl';
import { GraphNode } from '../lib/grap-data/types';

export interface InfoViewProps {
    data: GraphNode;
};

export const InfoView = ({data}: InfoViewProps) => {
    const displayedInfo = [
        <><FormattedMessage id="federation_entity_type_label" />: {data.info.type}</>,
        <><FormattedMessage id="immediate_subordinate_count_label" />: {data.info.immDependants.length}</>,
        <><FormattedMessage id="status_label" />: {data.info.ec.valid ? "valid" : "invalid"}</>,
        <><FormattedMessage id="expired_label" />: {data.info.ec.expired ? "expired" : "not expired"}</>,
        <><FormattedMessage id="expiring_date_label" />: {new Date(data.info.ec.payload.exp * 1000).toISOString()}</>
    ];

    const toRow = (info: JSX.Element) => 
        <li className="justify-content-md-start">
            <p style={{fontSize: "60%"}}>{info}</p>
        </li>

    return (
        <ul style={{textAlign: "left"}}>
            {displayedInfo.map(toRow)}
        </ul>
    );
};