import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InputAtom } from '../atoms/Input';
import { PaginatedListAtom } from '../atoms/PaginatedList';
import { Link } from 'react-router-dom';
import { isValidUrl } from "../lib/utils";
import { GraphViewComponent } from './GraphView';
import styles from '../css/BodyComponent.module.css';
import trustChainList from '../assets/trustChainList.json';

const ItemsRenderer = ({ items }: { items: any[] }) => {
    return (
        <>
        {items && items.map((d) => <li key={d.url}><Link to={`/?trustAnchorUrl=${d.url}`}>{d.name} - {d.url}</Link></li>)}
        </>
    );
};

const trustAnchorFilter = (anchor: any, filterValue: string) => anchor.name.toLowerCase().includes(filterValue.toLowerCase());

export const BodyComponent = () => {
    const conponents = {
        InputAtom: <InputAtom validationFn={isValidUrl} />,
        TrstAnchorListAtom: <PaginatedListAtom itemsPerPage={5} items={trustChainList} ItemsRenderer={ItemsRenderer} filterFn={trustAnchorFilter}/>,
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