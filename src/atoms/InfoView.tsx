import { FormattedMessage } from 'react-intl';

export interface InfoViewProps {
    data: any;
}

export const InfoView = ({data}: InfoViewProps) => {
    const displayedInfo = [
        <h6><FormattedMessage id="federation_entity_type_label" />: {data.info.type}</h6>,
        <h6><FormattedMessage id="immediate_subordinate_count_label" />: {data.info.dependantsLen}</h6>,
        <h6><FormattedMessage id="status_label" />: {data.info.tree.data.ec.valid ? "valid" : "invalid"}</h6>
    ];

    const toRow = (info: JSX.Element) => <div className="row justify-content-md-start"><div className="col-md-auto">{info}</div></div>

    return (
        <div className="container">
            {displayedInfo.map(toRow)}
        </div>
    );
}