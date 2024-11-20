
import { FC, useEffect, CSSProperties, useState } from "react";
import { MultiDirectedGraph } from "graphology";

import { FormattedMessage } from "react-intl";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useSearchParams } from "react-router-dom";

const TrustAnchorGraph: FC = () => {
    const loadGraph = useLoadGraph();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!searchParams.has('trustAnchorUrl')) {
            return;
        }

        const graph = new MultiDirectedGraph();
        const trustAnchorUrl = searchParams.get('trustAnchorUrl');

        graph.addNode("A", { x: 0, y: 0, label: "Node A", size: 10 });
        graph.addNode("B", { x: 1, y: 1, label: "Node B", size: 10 });
        graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });

        loadGraph(graph);

    }, [searchParams]);

    return null;
};

export const GraphView: FC<{ style?: CSSProperties }> = ({ style }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        if (searchParams.has('trustAnchorUrl')) return setVisible(true);
    }, [searchParams]);

    return (
        <div>
            <div style={{visibility:  isVisible? 'visible' : 'hidden' }}>
                <div className="alert alert-success" role="alert"><FormattedMessage id='display_info_for' /> {`${searchParams.get('trustAnchorUrl')}`}</div>
                <SigmaContainer style={style}>
                        <TrustAnchorGraph />
                </SigmaContainer>
            </div>
            <div style={{visibility:  !isVisible? 'visible' : 'hidden' }}>
                <div className="alert alert-info" role="alert"><FormattedMessage id='url_insert_placeholder' /></div>
            </div>

        </div>
    );
};