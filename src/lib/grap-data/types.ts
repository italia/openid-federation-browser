import { NodeInfo } from "../openid-federation/types";
import { Tree } from '@easygrating/easytree';

export interface Node {
    id: string;
    label: string;
    info: {
        type: string;
        dependantsLen: number;
        tree: Tree<NodeInfo>;
    };
};

export interface Edge {
    id: string;
    source: string;
    target: string;
    label: string;
};

export interface Graph {
    nodes: Node[];
    edges: Edge[];
};

export const NodeColor = {
    "Trust Anchor": "#FF6347",
    "Intermediate": "#1E90FF",
    "Leaf": "#CBDFAC",
    "StartNode": "#FF8C00",
    "Undiscovered": "#696969"
};

export enum NodeType {
    Anchor = "Trust Anchor",
    Intermediate = "Intermediate",
    Leaf = "Leaf",
    StartNode = "StartNode",
    Undiscovered = "Undiscovered",
};