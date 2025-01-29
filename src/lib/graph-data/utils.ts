import { NodeInfo } from "../openid-federation/types";
import { Graph, GraphNode, GraphEdge, EntityColor } from "./types";
import { cleanEntityID } from "../utils";

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
    subStatement: child.ec.subordinates[parent.ec.entity],
  } as GraphEdge;
};

export const updateGraph = (node: NodeInfo, graph: Graph): Graph => {
  const alreadyExists = graph.nodes.find((n) => n.id === node.ec.entity);

  if (alreadyExists) return graph;

  const newGraphNode = genNode(node);
  const nodes = [...graph.nodes, newGraphNode];

  return { nodes, edges: graph.edges };
};

export const fromNodeInfo = (node: NodeInfo): Graph => {
  return { nodes: [genNode(node)], edges: [] };
};

export const removeNode = (graph: Graph, id: string): Graph => {
  const nodes = graph.nodes.filter(
    (node) => cleanEntityID(node.id) !== cleanEntityID(id),
  );
  const edges = graph.edges.filter(
    (edge) =>
      cleanEntityID(edge.source) !== cleanEntityID(id) &&
      cleanEntityID(edge.target) !== cleanEntityID(id),
  );

  return { nodes, edges };
};

export const removeSubGraph = (
  graph: Graph,
  id: string,
  subordinate: boolean = true,
): Graph => {
  const nodes = graph.nodes.filter(
    (node) => !node.id.startsWith(id) && !id.startsWith(node.id),
  );
  const edges = graph.edges.filter(
    (edge) => edge.source !== id && edge.target !== id,
  );

  const filteredGraph = graph.edges
    .filter((edge) => (subordinate ? edge.source : edge.target) === id)
    .map((edge) => edge.target)
    .reduce((acc, target) => removeSubGraph(acc, target, subordinate), {
      nodes,
      edges,
    });

  return filteredGraph;
};

export const isEdge = (elm: any) =>
  elm.hasOwnProperty("source") && elm.hasOwnProperty("target");
export const isNode = (elm: any) => !isEdge(elm);

export const isDiscovered = (graph: Graph, dep: string) =>
  graph.nodes.some((node) => cleanEntityID(node.id) === cleanEntityID(dep));

export const removeEntities = (graph: Graph, entityIDs: string | string[]) => {
  return Array.isArray(entityIDs)
    ? entityIDs.reduce((acc, id) => removeNode(acc, id), graph)
    : removeNode(graph, entityIDs);
};

export const areDisconnected = (graph: Graph, nodeA: string, nodeB: string) => {
  return !graph.edges.some(
    (edge) =>
      (cleanEntityID(edge.source) === cleanEntityID(nodeA) &&
        cleanEntityID(edge.target) === cleanEntityID(nodeB)) ||
      (cleanEntityID(edge.target) === cleanEntityID(nodeA) &&
        cleanEntityID(edge.source) === cleanEntityID(nodeB)),
  );
};
