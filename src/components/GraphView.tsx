
import { useSearchParams } from "react-router-dom";
import { traverseUp } from "../lib/openid-federation/trustChain";
import { genGraph } from "../lib/grap-data/graphGeneration";
import { GraphCanvas } from "reagraph";
import { Node, Edge } from "../lib/grap-data/types";
import { ContextMenuComponent } from "./ContextMenu";
import { LoadingAtom } from "../atoms/Loading";
import { ErrorViewAtom } from "../atoms/ErrorView";
import styles from '../css/BodyComponent.module.css';
import { NodeInfo } from "../lib/openid-federation/types";
import { Tree } from '@easygrating/easytree';
import { 
    FC, 
    useEffect, 
    CSSProperties, 
    useState
} from "react";

enum ShowElement {
    Loading = 'loading-atom',
    Error = 'error-atom',
    Graph = 'graph-atom'
}

export const GraphViewComponent: FC<{ style?: CSSProperties }> = ({ style }) => {
    const [searchParams] = useSearchParams();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [error, setError] = useState<Error>(new Error(""));
    const [showElement, setShowElement] = useState<ShowElement>(ShowElement.Loading);

    const updateGraph = (newTree: Tree<NodeInfo>) => {
        const { nodes, edges } = genGraph(newTree as Tree<NodeInfo>);

        setNodes(nodes);
        setEdges(edges);

        setShowElement(ShowElement.Graph);
    };

    const setErrorMessage = (e: Error) => {
        console.error(e);
        setError(e);
        setShowElement(ShowElement.Error);
    };

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
            {
                showElement === ShowElement.Loading 
                    ? <LoadingAtom /> :
                showElement === ShowElement.Error ?
                    <ErrorViewAtom error={error} /> :
                    <GraphCanvas nodes={nodes} edges={edges} contextMenu={({ data, onClose }) => (
                        <ContextMenuComponent data={data} onClose={onClose} onUpdate={(newTree: Tree<NodeInfo>) => updateGraph(newTree)} onError={setErrorMessage} />
                    )} />
            }
        </div>
    );
};