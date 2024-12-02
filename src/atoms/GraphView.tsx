
import { useSearchParams } from "react-router-dom";
import { traverseUp } from "../lib/openid-federation/trustChain";
import { genGraph } from "../lib/grap-data/graphGeneration";
import { GraphCanvas } from "reagraph";
import { Node, Edge } from "../lib/grap-data/types";
import { ContextMenuAtom } from "./ContextMenu";
import { LoadingAtom } from "./Loading";
import { handleCollapseVisibility } from "../lib/utils";
import { ErrorViewAtom } from "./ErrorView";
import styles from '../css/BodyComponent.module.css';
import { NodeInfo } from "../lib/openid-federation/types";
import { Tree } from '@easygrating/easytree';
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
    const [error, setError] = useState<Error>(new Error(""));

    const updateGraph = (newTree: Tree<NodeInfo>) => {
        const { nodes, edges } = genGraph(newTree as Tree<NodeInfo>);

        setNodes(nodes);
        setEdges(edges);

        handleCollapseVisibility('loading-atom', false);
        handleCollapseVisibility('error-atom', false);
        handleCollapseVisibility('graph-atom', true);
    };

    const setErrorMessage = (e: Error) => {
        console.error(e);
        setError(e);
        handleCollapseVisibility('loading-atom', false);
        handleCollapseVisibility('graph-atom', false);
        handleCollapseVisibility('error-atom', true);
    };

    useEffect(() => {
        handleCollapseVisibility('graph-atom', false);
        handleCollapseVisibility('error-atom', false);
        handleCollapseVisibility('loading-atom', true);
    }, []);


    useEffect(() => {
        if (!searchParams.has('trustAnchorUrl')) {
            return;
        }

        const trustAnchorUrl = searchParams.get('trustAnchorUrl') as string;

        traverseUp(trustAnchorUrl).then(tree => {
            updateGraph(tree);
        }).catch(setErrorMessage);

    }, [searchParams]);

    return (
        <div className={styles.graphAtom}>
            <div className="collapse" id="error-atom">
                <ErrorViewAtom error={error} />
            </div>
            <div className="collapse" id="graph-atom">
                <GraphCanvas nodes={nodes} edges={edges} contextMenu={({ data, onClose }) => (
                    <ContextMenuAtom data={data} onClose={onClose} onUpdate={(newTree: Tree<NodeInfo>) => updateGraph(newTree)} onError={setErrorMessage} />
                )} />
            </div>
            <div className="collapse" id="loading-atom"><LoadingAtom /></div>
        </div>
    );
};