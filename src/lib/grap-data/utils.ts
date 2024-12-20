import { NodeInfo } from "../openid-federation/types";
import { Graph, GraphNode, GraphEdge, EntityColor } from "./types";

export const genNode = (node: NodeInfo): GraphNode => {
  return {
    id: node.ec.entity,
    label: node.ec.entity,
    fill: EntityColor[node.type],
    info: node,
  } as GraphNode;
};

export const genEdge = (parent: NodeInfo, child: NodeInfo): GraphEdge => {
  return {
    id: `${parent.ec.entity}-${child.ec.entity}`,
    source: parent.ec.entity,
    target: child.ec.entity,
    label: `${parent.ec.entity}->${child.ec.entity}`,
    subStatement: child.ec.subordinate,
  } as GraphEdge;
};

export const updateGraph = (
  parent: NodeInfo,
  child: NodeInfo,
  graph: Graph,
): Graph => {
  const nodes = 
    !graph.nodes.find(n => n.id === child.ec.entity) 
      ? [...graph.nodes, genNode(child)]
      : graph.nodes;

  const edges = !graph.edges.find(e => e.id === `${parent.ec.entity}-${child.ec.entity}`) 
    ? [...graph.edges, genEdge(parent, child)]
    : graph.edges;

  return { nodes, edges };
};

export const fromNodeInfo = (node: NodeInfo): Graph => {
  return { nodes: [genNode(node)], edges: [] };
};

export const removeSubGraph = (graph: Graph, id: string): Graph => {
  const nodes = graph.nodes.filter((node) => node.id !== id);
  const edges = graph.edges.filter(
    (edge) => edge.source !== id && edge.target !== id,
  );

  const filteredGraph = graph.edges
    .filter((edge) => edge.source === id)
    .map((edge) => edge.target)
    .reduce((acc, target) => removeSubGraph(acc, target), { nodes, edges });

  return filteredGraph;
};

export const isEdge = (elm: any) =>
  elm.hasOwnProperty("source") && elm.hasOwnProperty("target");
export const isNode = (elm: any) => !isEdge(elm);
