import { Tree } from '@easygrating/easytree';
import { NodeInfo } from '../openid-federation/types';
import { Graph, Node, Edge, NodeColor } from './types';
import { getNodeType } from './utils';

export const genGraph = (tree: Tree<NodeInfo>, graph: Graph = {nodes: [], edges: []}, maxChilds: number = 10) => {
    const nodeType = getNodeType(tree);
    const label = tree.id.toString();

    graph.nodes.push({id: tree.id, label, fill: NodeColor[nodeType], info: {type: nodeType, dependantsLen: tree.data.immDependants.length, tree}} as Node);
    
    if (tree.parent){
        graph.edges.push({id: `${tree.parent.id}-${tree.id}`, source: tree.id, target: tree.parent.id, label: `${tree.parent.id}->${tree.id}`} as Edge);
    }

    if (tree.children.length === 0){
        return graph;
    }

    const completeGraph: Graph = tree.children.reduce((accGraph, child) => {
        return genGraph(child, accGraph);
    }, graph);

    return completeGraph;
};