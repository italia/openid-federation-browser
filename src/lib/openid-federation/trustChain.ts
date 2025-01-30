import * as jose from "jose";
import axios from "axios";
import { jsonToPublicKey } from "./utils";
import {
  validateSubordinateStatement,
  validateEntityConfiguration,
} from "./validation";
import {
  EntityConfiguration,
  NodeInfo,
  JWTHeader,
  EntityConfigurationPayload,
  SubordianteStatement,
  EntityType,
  SubordinateStatementPayload,
} from "./types";
import { Graph, GraphEdge } from "../graph-data/types";
import { genEdge, updateGraph } from "../graph-data/utils";
import { setEntityType } from "./utils";
import { checkViewValidity } from "./utils";
import Ajv from "ajv";
import schema from "../graph-data/graph.schema.json";

const schemaValidator = new Ajv().compile(schema);

const cors_proxy = process.env.REACT_APP_CORS_PROXY || "";

const getSubordinateStatement = async (
  fetchEndpoint: string,
  sub: string,
  ec: EntityConfiguration,
): Promise<SubordianteStatement> => {
  const completeFetchEndpoint = `${fetchEndpoint}?sub=${sub}`;
  const response = await axios.get(cors_proxy + completeFetchEndpoint);
  const payload = jose.decodeJwt(response.data) as SubordinateStatementPayload;
  const header = jose.decodeProtectedHeader(response.data) as JWTHeader;

  payload.jwks.keys = payload.jwks.keys.map((jwk) => jsonToPublicKey(jwk));

  const subordinate: SubordianteStatement = {
    jwt: response.data,
    header,
    payload,
    valid: false,
  };
  await validateSubordinateStatement(subordinate, ec);

  return subordinate;
};

const getEntityConfigurations = async (
  subject: string,
  wellKnownEndpoint: string = ".well-known/openid-federation",
): Promise<EntityConfiguration> => {
  const subjectWellKnown = subject.endsWith("/") ? subject : subject + "/";

  const { data: jwt } = await axios.get(
    cors_proxy + subjectWellKnown + wellKnownEndpoint,
  );

  const header = jose.decodeProtectedHeader(jwt) as JWTHeader;
  const payload = jose.decodeJwt(jwt) as EntityConfigurationPayload;
  payload.jwks.keys = payload.jwks.keys.map((jwk) => jsonToPublicKey(jwk));

  const ec: EntityConfiguration = {
    entity: subject,
    jwt,
    header,
    payload,
    valid: false,
    subordinates: {},
  };
  await validateEntityConfiguration(ec);

  return ec;
};

export const discoverNode = async (
  currenECUrl: string,
  graph: Graph = { nodes: [], edges: [] },
): Promise<Graph> => {
  const currentNodeEC = await getEntityConfigurations(currenECUrl);
  const federationListEndpoint =
    currentNodeEC.payload.metadata?.federation_entity?.federation_list_endpoint;

  const currentNode: NodeInfo = {
    ec: currentNodeEC,
    immDependants: [],
    type: EntityType.Leaf,
  };

  if (federationListEndpoint) {
    const response = await axios.get(cors_proxy + federationListEndpoint);
    if (!Array.isArray(response.data))
      throw new Error("Invalid subordinate list response");
    currentNode.immDependants = response.data;
  }

  if (currentNodeEC.payload.trust_marks) {
    currentNode.trustMarks = currentNodeEC.payload.trust_marks.map(
      (tm: Record<string, string>) => ({
        id: tm.id,
        header: jose.decodeProtectedHeader(tm.trust_mark) as Record<
          string,
          any
        >,
        payload: jose.decodeJwt(tm.trust_mark) as Record<string, any>,
        jwt: tm.trust_mark,
      }),
    );
  }

  setEntityType(currentNode);

  const authority_hints = currentNode.ec.payload.authority_hints;

  if (authority_hints) {
    const existentParents = graph.nodes.filter((node) =>
      authority_hints.some((ah) => ah.startsWith(node.id)),
    );

    await Promise.all(
      existentParents.map(async (parent) => {
        const federationFetchEndpoint =
          parent.info.ec.payload?.metadata?.federation_entity
            ?.federation_fetch_endpoint;

        if (federationFetchEndpoint) {
          try {
            const subordinateStatements = await getSubordinateStatement(
              federationFetchEndpoint,
              currenECUrl,
              parent.info.ec,
            );

            currentNode.ec.subordinates[parent.info.ec.entity] =
              subordinateStatements;
          } catch (e) {
            console.error(e);
          }
        }
      }),
    );
  }

  if (currentNode.immDependants.length > 0) {
    const existentChildren = graph.nodes.filter((node) =>
      currentNode.immDependants.includes(node.id),
    );

    const federationFetchEndpoint =
      currentNode.ec.payload?.metadata?.federation_entity
        ?.federation_fetch_endpoint;

    await Promise.all(
      existentChildren.map(async (child) => {
        if (federationFetchEndpoint) {
          try {
            const subordinateStatements = await getSubordinateStatement(
              federationFetchEndpoint,
              child.id,
              currentNode.ec,
            );

            child.info.ec.subordinates[currentNode.ec.entity] =
              subordinateStatements;
          } catch (e) {
            console.error(e);
          }
        }
      }),
    );
  }

  return updateGraph(currentNode, graph);
};

export const discoverNodes = async (
  entities: string[],
  graph: Graph = { nodes: [], edges: [] },
): Promise<{ graph: Graph; failed: { entity: string; error: Error }[] }> => {
  let newGraph = graph;
  const failed: { entity: string; error: Error }[] = [];

  for (const entity of entities) {
    try {
      newGraph = await discoverNode(entity, newGraph);
    } catch (e) {
      console.error(e);
      failed.push({ entity, error: e as Error });
    }
  }

  return { graph: newGraph, failed };
};

export const traverseUp = async (
  currenECUrl: string,
  child: NodeInfo | undefined = undefined,
  graph: Graph = { nodes: [], edges: [] },
): Promise<Graph> => {
  const newGraph = await discoverNode(currenECUrl, graph);
  const discoveredNode = newGraph.nodes.find((node) => node.id === currenECUrl);

  if (!discoveredNode) return newGraph;

  if (child) newGraph.edges.push(genEdge(discoveredNode.info, child));

  const authorityHints = discoveredNode.info.ec.payload?.authority_hints;

  if (authorityHints && authorityHints.length > 0)
    return traverseUp(authorityHints[0], discoveredNode.info, newGraph);

  return newGraph;
};

export const evaluateTrustChain = (
  { nodes, edges }: Graph,
  selected: string[],
): string | undefined => {
  const selectedNodes = nodes.filter((node) => selected.includes(node.id));
  const leafNodesNumber = selectedNodes.filter(
    (node) => node.info.type === "Leaf",
  ).length;
  const anchorNodesNumber = selectedNodes.filter(
    (node) => node.info.type === "Trust Anchor",
  ).length;

  if (leafNodesNumber !== 1 || anchorNodesNumber !== 1) {
    return undefined;
  }

  const affectedEdges = edges.filter(
    (edge) =>
      selected.find(
        (node) => node === edge.source && selected.includes(edge.target),
      ) ||
      selected.find(
        (node) => node === edge.target && selected.includes(edge.source),
      ),
  );

  if (affectedEdges.length === 0) {
    return undefined;
  } else if (affectedEdges.length !== selectedNodes.length - 1) {
    return undefined;
  }

  const orderedEdges = affectedEdges.sort((a, b) => {
    const aSource = selectedNodes.find((node) => node.id === a.source);
    const aTarget = selectedNodes.find((node) => node.id === a.target);
    const bSource = selectedNodes.find((node) => node.id === b.source);
    const bTarget = selectedNodes.find((node) => node.id === b.target);

    if (aSource && aTarget && bSource && bTarget) {
      if (
        aSource.info.type === "Trust Anchor" &&
        aTarget.info.type === "Intermediate"
      ) {
        return -1;
      } else if (
        bSource.info.type === "Trust Anchor" &&
        bTarget.info.type === "Intermediate"
      ) {
        return 1;
      } else if (
        aSource.info.type === "Intermediate" &&
        aTarget.info.type === "Leaf"
      ) {
        return -1;
      } else if (
        bSource.info.type === "Intermediate" &&
        bTarget.info.type === "Leaf"
      ) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  });

  if (orderedEdges.length === 0) {
    let currentEdge = orderedEdges[0];

    for (let i = 1; i < orderedEdges.length; i++) {
      if (currentEdge.target === orderedEdges[i].source) {
        currentEdge = orderedEdges[i];
      } else {
        return undefined;
      }
    }
  }

  const reversedOrderedEdges = orderedEdges.reverse();

  const trustChain = reversedOrderedEdges.map((edge) => edge.subStatement?.jwt);
  trustChain.unshift(
    selectedNodes.find((node) => node.id === reversedOrderedEdges[0].target)
      ?.info.ec.jwt as string,
  );
  trustChain.push(
    selectedNodes.find(
      (node) =>
        node.id ===
        reversedOrderedEdges[reversedOrderedEdges.length - 1].source,
    )?.info.ec.jwt as string,
  );

  return JSON.stringify(trustChain);
};

export const exportView = (
  graph: Graph,
  staticExport: boolean = false,
): string => {
  if (staticExport) return JSON.stringify(graph, null, 2);

  return JSON.stringify(
    {
      nodes: graph.nodes.map((node) => node.id),
      edges: graph.edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
      })),
    },
    null,
    2,
  );
};

export const importView = async (view: string): Promise<Graph> => {
  let parsed;

  try {
    parsed = JSON.parse(view);
  } catch (e) {
    throw new Error("Not a valid JSON");
  }

  if (parsed.nodes.length === 0) throw new Error("Empty view data");

  if (typeof parsed.nodes[0] === "object") {
    const staticSchemaCheck = schemaValidator(parsed);
    if (!staticSchemaCheck) {
      throw new Error("Invalid view data");
    }
    return parsed as Graph;
  }

  parsed = parsed as {
    nodes: string[];
    edges: { source: string; target: string }[];
  };

  if (!checkViewValidity(parsed)) throw new Error("Invalid view data");

  const newNodes = await Promise.all(
    parsed.nodes.map(async (entity) => (await discoverNode(entity)).nodes[0]),
  );
  const newEdges: GraphEdge[] = await Promise.all(
    parsed.edges.map(async (edge) => {
      const parent = newNodes.find((node) => node.id === edge.source);
      const currentNode = newNodes.find((node) => node.id === edge.target);

      if (!parent || !currentNode) throw new Error("Invalid graph data");

      const label = `${edge.source}-${edge.target}`;
      const federationFetchEndpoint =
        parent.info.ec.payload?.metadata?.federation_entity
          ?.federation_fetch_endpoint;

      if (federationFetchEndpoint) {
        try {
          const subordinateStatements = await getSubordinateStatement(
            federationFetchEndpoint,
            edge.target,
            parent.info.ec,
          );

          currentNode.info.ec.subordinates[parent.info.ec.entity] =
            subordinateStatements;
        } catch (e) {
          console.error(e);
        }
      }

      return {
        id: label,
        label,
        subStatement: currentNode.info.ec.subordinates[parent.info.ec.entity],
        source: edge.source,
        target: edge.target,
      };
    }),
  );

  return {
    nodes: newNodes,
    edges: newEdges,
  };
};
