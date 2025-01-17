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
    subStatement: child.ec.subordinates[parent.ec.entity],
  } as GraphEdge;
};

export const addChildToGraph = (
  parent: NodeInfo,
  child: NodeInfo,
  graph: Graph,
): Graph => {
  const nodes = !graph.nodes.find((n) => n.id === child.ec.entity)
    ? [...graph.nodes, genNode(child)]
    : graph.nodes;

  let edges = !graph.edges.find(
    (e) => e.id === `${parent.ec.entity}-${child.ec.entity}`,
  )
    ? [...graph.edges, genEdge(parent, child)]
    : graph.edges;

  const authorityHints = child.ec.payload.authority_hints;

  if (authorityHints) {
    const disconnectedHints = authorityHints.filter(
      (hint) => edges.find((edge) => edge.source === hint) === undefined,
    );
    const toConnectNodes = nodes.filter((n) =>
      disconnectedHints.includes(n.id),
    );

    edges = [
      ...edges,
      ...toConnectNodes.map((node) => genEdge(node.info, child)),
    ];
  }

  return { nodes, edges };
};

export const addParentToGraph = (
  parent: NodeInfo,
  child: NodeInfo,
  graph: Graph,
): Graph => {
  const nodes = !graph.nodes.find((n) => n.id === parent.ec.entity)
    ? [...graph.nodes, genNode(parent)]
    : graph.nodes;

  let edges = !graph.edges.find(
    (e) => e.id === `${parent.ec.entity}-${child.ec.entity}`,
  )
    ? [...graph.edges, genEdge(parent, child)]
    : graph.edges;

  const authorityHints = parent.ec.payload.authority_hints;

  if (authorityHints) {
    const existentAuthorityHints = nodes.filter(
      (node) => authorityHints.find((hint) => node.id === hint) !== undefined,
    );

    edges = [
      ...edges,
      ...existentAuthorityHints.map((node) => genEdge(node.info, parent)),
    ];
  }

  return { nodes, edges };
};

export const fromNodeInfo = (node: NodeInfo): Graph => {
  return { nodes: [genNode(node)], edges: [] };
};

export const removeSubGraph = (
  graph: Graph,
  id: string,
  subordinate: boolean = true,
): Graph => {
  const nodes = graph.nodes.filter((node) => node.id !== id);
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
