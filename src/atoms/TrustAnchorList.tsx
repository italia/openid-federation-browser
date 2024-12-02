import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from '../css/BodyComponent.module.css';
import trustChainList from '../assets/trustChainList.json';

interface TrustAnchorLink {
    name: string;
    url: string;
}

type TrustAnchorList = TrustAnchorLink[];

export const TrstAnchorListAtom = () => {
    const [searchValue, setSearchValue] = useState('');
    const [anchorsList, setAnchorsList] = useState(trustChainList);

    const changeSearchValue = (e: any) => setSearchValue(e.target.value);
    const renderAnchorList = (data: TrustAnchorList) => data.map((d) => <li key={d.url}><Link to={`/?trustAnchorUrl=${d.url}`}>{d.name} - {d.url}</Link></li>);

    useEffect(() => setAnchorsList(trustChainList), []);

    useEffect(() => {
        if (!searchValue) return setAnchorsList(trustChainList);

        const filteredList = trustChainList.filter((anchor) => anchor.name.toLowerCase().includes(searchValue.toLowerCase()));
        setAnchorsList(filteredList);
    }, [searchValue]);

    return (
        <div className={`it-list-wrapper ${styles.bodyElement}`}>
            <div className="row">
                <h4><FormattedMessage id="select_trust_node_url_label" /></h4>
            </div>
            <div className="row">
                <label className="col-2" htmlFor="input-value"><FormattedMessage id="search_label" /></label>
                <input type="text" className="form-control col-9" id="input-value" onChange={changeSearchValue} />
            </div>
            <ul className="it-list" style={{ overflow: 'hidden', overflowY: 'scroll' }}>{renderAnchorList(anchorsList)}</ul>
        </div>
    );
};