import { Tree } from '@easygrating/easytree';
import { NodeInfo } from '../openid-federation/types';
import { discovery, traverseUp } from '../openid-federation/trustChain';
import { Graph, Node, Edge } from './types';

const NodeColor = {
    "Trust Anchor": "#FF6347",
    "Intermediate": "#1E90FF",
    "Leaf": "#CBDFAC",
    "StartNode": "#FF8C00",
    "Undiscovered": "#696969"
};

enum NodeType {
    Anchor = "Trust Anchor",
    Intermediate = "Intermediate",
    Leaf = "Leaf",
    StartNode = "StartNode",
    Undiscovered = "Undiscovered",
};

const getNodeType = (tree: Tree<NodeInfo>): NodeType => {
    if (tree.data.startNode){
        return NodeType.StartNode;
    }

    if (!tree.data.ec.jwt){
        return NodeType.Undiscovered;
    }

    if (tree.children.length === 0){
        return NodeType.Leaf;
    }

    if (tree.parent){
        return NodeType.Intermediate;
    }

    return NodeType.Anchor;
};

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

export const traverseUpGraphFromUrl = async (url: string) => {
    const tree = await traverseUp(url);
    const graph = genGraph(tree);

    return graph;
};

export const genStartNodeGraphFromUrl = async (url: string) => {
    const startNode = await discovery(url);
    const graph = genGraph(startNode);

    return graph;
}