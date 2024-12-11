import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UrlInputAtom } from '../atoms/UrlInput';
import { PaginatedListAtom } from '../atoms/PaginatedList';
import { Link } from 'react-router-dom';
import { isValidUrl } from "../lib/utils";
import { GraphViewComponent } from './GraphView';
import styles from '../css/BodyComponent.module.css';
import trustChainList from '../assets/trustChainList.json';

export const BodyComponent = () => {
    const ItemsRenderer = ({ items }: { items: any[] }) => {
        return (
            <ul>
                {items && items.map((d) => <li key={d.url}><Link to={`/?trustAnchorUrl=${d.url}`}>{d.name} - {d.url}</Link></li>)}
            </ul>
        );
    };
    
    const trustAnchorFilter = (anchor: any, filterValue: string) => anchor.name.toLowerCase().includes(filterValue.toLowerCase());

    const conponents = {
        InputAtom: <div className={styles.bodyElement}><UrlInputAtom validationFn={isValidUrl} /></div>,
        TrstAnchorListAtom: <div className={styles.bodyElement}><PaginatedListAtom itemsPerPage={5} items={trustChainList} ItemsRenderer={ItemsRenderer} filterFn={trustAnchorFilter}/></div>,
        GraphView: <GraphViewComponent />
    };

    const [searchParams] = useSearchParams();
    const [visualizedAtom, setVisualizedAtom] = useState<JSX.Element>(conponents["InputAtom"]);

    useEffect(() => {
        if(searchParams.has('listUrl')){
            setVisualizedAtom(conponents["TrstAnchorListAtom"]);
        } else if (searchParams.has('trustAnchorUrl')) {
            setVisualizedAtom(conponents["GraphView"]);
        }else{
            setVisualizedAtom(conponents["InputAtom"]);
        }
    }, [searchParams]);

    return (
        <div className={styles.bodyContainer}>
            {visualizedAtom}
        </div>
    );
}