import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InputAtom } from '../atoms/Input';
import { TrstAnchorListAtom } from '../atoms/TrustAnchorList';
import { isValidUrl } from "../lib/utils";
import { GraphViewAtom } from '../atoms/GraphView';
import styles from '../css/BodyComponent.module.css';


export const BodyComponent = () => {
    const conponents = {
        InputAtom: <InputAtom validationFn={isValidUrl} />,
        TrstAnchorListAtom: <TrstAnchorListAtom />,
        GraphView: <GraphViewAtom />
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