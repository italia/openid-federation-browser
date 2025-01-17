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
import { Graph, GraphEdge, GraphNode } from "../graph-data/types";
import { genNode, updateGraph } from "../graph-data/utils";
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

export const discovery = async (currenECUrl: string): Promise<NodeInfo> => {
  const currentNodeEC = await getEntityConfigurations(currenECUrl);
  const federationListEndpoint =
    currentNodeEC.payload.metadata?.federation_entity?.federation_list_endpoint;

  const nodeInfo: NodeInfo = {
    ec: currentNodeEC,
    immDependants: [],
    type: EntityType.Leaf,
  };

  if (federationListEndpoint) {
    const response = await axios.get(cors_proxy + federationListEndpoint);
    if (!Array.isArray(response.data))
      throw new Error("Invalid subordinate list response");
    nodeInfo.immDependants = response.data;
  }

  setEntityType(nodeInfo);

  return nodeInfo;
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

  setEntityType(currentNode);

  if (currentNode.ec.payload.authority_hints) {
    const existentParents = graph.nodes.filter((node) =>
      currentNode.ec.payload.authority_hints?.includes(node.id),
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
  const discoveredNode = await discovery(currenECUrl);

  const federationFetchEndpoint =
    discoveredNode.ec.payload?.metadata?.federation_entity
      ?.federation_fetch_endpoint;

  if (federationFetchEndpoint && child) {
    try {
      const subordinateStatements = await getSubordinateStatement(
        federationFetchEndpoint,
        child.ec.entity as string,
        discoveredNode.ec,
      );
      child.ec.subordinates[discoveredNode.ec.entity] = subordinateStatements;
    } catch (e) {
      console.error(e);
    }
  }

  const authorityHints = discoveredNode.ec.payload?.authority_hints;

  graph = updateGraph(discoveredNode, graph);

  if (authorityHints && authorityHints.length > 0) {
    return traverseUp(authorityHints[0], discoveredNode, graph);
  }

  return graph;
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
    parsed.nodes.map(async (entity) => genNode(await discovery(entity))),
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
