export interface Node {
    id: string;
    label: string;
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