
import { useSearchParams } from "react-router-dom";
import { genGraphFromUrl } from "../lib/grap-data/graphGeneration";
import { GraphCanvas } from "reagraph";
import { Node, Edge } from "../lib/grap-data/types";
import { ContextMenuAtom } from "./ContextMenu";
import { LoadingAtom } from "./Loading";
import { handleCollapseVisibility } from "../lib/utils";
import { 
    FC, 
    useEffect, 
    CSSProperties, 
    useState
} from "react";

export const GraphViewAtom: FC<{ style?: CSSProperties }> = ({ style }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        if (!searchParams.has('trustAnchorUrl')) {
            return;
        }

        handleCollapseVisibility('graph-atom', false);
        handleCollapseVisibility('loading-atom', true);

        const trustAnchorUrl = searchParams.get('trustAnchorUrl') as string;

        genGraphFromUrl(trustAnchorUrl).then(graph => {
            setNodes(graph.nodes);
            setEdges(graph.edges);
            handleCollapseVisibility('graph-atom', true);
            handleCollapseVisibility('loading-atom', false);
        });

    }, [searchParams]);


    return (
        <div style={{ position: "relative", height: "90vh", width: "100vw"}}>
            <div className="collapse" id="graph-atom">
                <GraphCanvas nodes={nodes} edges={edges} contextMenu={({ data, onClose }) => (
                    <ContextMenuAtom data={data} onClose={onClose} />
                )} />
            </div>
            <div className="collapse" id="loading-atom"><LoadingAtom /></div>
        </div>
    );
};