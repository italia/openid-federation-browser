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