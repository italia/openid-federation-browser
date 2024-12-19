import { SubordianteStatement, NodeInfo } from "../openid-federation/types";

export interface GraphNode {
  id: string;
  label: string;
  info: NodeInfo;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  subStatement?: SubordianteStatement;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const EntityColor = {
  "Trust Anchor": "#FF6347",
  Intermediate: "#1E90FF",
  Leaf: "#CBDFAC",
  StartNode: "#FF8C00",
  Undiscovered: "#696969",
};
