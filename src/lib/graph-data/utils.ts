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

export const updateGraph = (node: NodeInfo, graph: Graph): Graph => {
  const alreadyExists = graph.nodes.find((n) => n.id === node.ec.entity);

  if (alreadyExists) return graph;

  const newGraphNode = genNode(node);
  const nodes = [...graph.nodes, newGraphNode];

  let edges = graph.edges;

  const authorityHints = node.ec.payload.authority_hints;

  if (authorityHints) {
    const toConnectNodes = nodes.filter((node) =>
      authorityHints.some((ah) => ah.startsWith(node.id)),
    );

    edges = [
      ...edges,
      ...toConnectNodes.map((cNode) => genEdge(cNode.info, node)),
    ];
  }

  const immDependants = node.immDependants;

  const toConnectNodes = nodes.filter((n) => immDependants.includes(n.id));

  edges = [
    ...edges,
    ...toConnectNodes.map((pNode) => genEdge(node, pNode.info)),
  ];

  nodes.forEach((n) => {
    if (n.id === node.ec.entity) return;

    if (
      n.info.immDependants.includes(node.ec.entity) &&
      !edges.find((e) => e.source === n.id && e.target === node.ec.entity) &&
      !edges.find((e) => e.source === node.ec.entity && e.target === n.id)
    ) {
      edges = [...edges, genEdge(n.info, node)];
    }

    if (
      n.info.ec.payload.authority_hints?.includes(node.ec.entity) &&
      !edges.find((e) => e.source === node.ec.entity && e.target === n.id) &&
      !edges.find((e) => e.source === n.id && e.target === node.ec.entity)
    ) {
      edges = [...edges, genEdge(node, n.info)];
    }
  });

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
