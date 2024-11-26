
import { FC, useEffect, CSSProperties, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { genGraphFromUrl } from "../lib/grap-data/graphGeneration";
import { GraphCanvas } from "reagraph";
import { Node, Edge } from "../lib/grap-data/types";
import { ContextMenuAtom } from "../atoms/ContextMenu";

export const GraphView: FC<{ style?: CSSProperties }> = ({ style }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isVisible, setVisible] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        if (!searchParams.has('trustAnchorUrl')) {
            return;
        }

        const trustAnchorUrl = searchParams.get('trustAnchorUrl') as string;

        genGraphFromUrl(trustAnchorUrl).then(graph => {
            setNodes(graph.nodes);
            setEdges(graph.edges);
        });

    }, [searchParams]);

    useEffect(() => {
        if (searchParams.has('trustAnchorUrl')) return setVisible(true);
    }, [searchParams]);
    

    return (
        <div>
            <div style={{ position: "fixed", width: '50%', height: '60%', visibility:  isVisible? 'visible' : 'hidden'}}>
                <div className="alert alert-success" role="alert"><FormattedMessage id='display_info_for' /> {`${searchParams.get('trustAnchorUrl')}`}</div>
                <GraphCanvas nodes={nodes} edges={edges} contextMenu={({ data, onClose }) => (
                    <ContextMenuAtom data={data} onClose={onClose} />
                )} />
            </div>
            <div style={{visibility:  !isVisible? 'visible' : 'hidden' }}>
                <div className="alert alert-info" role="alert"><FormattedMessage id='url_insert_placeholder' /></div>
            </div>

        </div>
    );
};