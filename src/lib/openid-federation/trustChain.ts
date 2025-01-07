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
import { Graph } from "../grap-data/types";
import { updateGraph, genNode } from "../grap-data/utils";
import { setEntityType } from "./utils";

const getSubordinateStatement = async (
  fetchEndpoint: string,
  sub: string,
  ec: EntityConfiguration,
): Promise<SubordianteStatement> => {
  const completeFetchEndpoint = `${fetchEndpoint}?sub=${sub}`;
  const response = await axios.get(completeFetchEndpoint);
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

  const { data: jwt } = await axios.get(subjectWellKnown + wellKnownEndpoint);

  const header = jose.decodeProtectedHeader(jwt) as JWTHeader;
  const payload = jose.decodeJwt(jwt) as EntityConfigurationPayload;
  payload.jwks.keys = payload.jwks.keys.map((jwk) => jsonToPublicKey(jwk));

  const ec: EntityConfiguration = {
    entity: subject,
    jwt,
    header,
    payload,
    valid: false,
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
    const response = await axios.get(federationListEndpoint);
    nodeInfo.immDependants = response.data;
  }

  setEntityType(nodeInfo);

  return nodeInfo;
};

export const discoverChild = async (
  currenECUrl: string,
  parent: NodeInfo,
  graph: Graph = { nodes: [], edges: [] },
): Promise<Graph> => {
  const currentNode = await discovery(currenECUrl);

  const federationFetchEndpoint =
    parent.ec.payload?.metadata?.federation_entity?.federation_fetch_endpoint;

  if (federationFetchEndpoint)
    currentNode.ec.subordinate = await getSubordinateStatement(
      federationFetchEndpoint,
      currenECUrl,
      parent.ec,
    );

  return updateGraph(parent, currentNode, graph);
};

export const discoverParent = async (
  currenECUrl: string,
  child: NodeInfo,
  graph: Graph = { nodes: [], edges: [] },
): Promise<Graph> => {
  const currentNode = await discovery(currenECUrl);

  const federationFetchEndpoint =
    currentNode.ec.payload?.metadata?.federation_entity
      ?.federation_fetch_endpoint;

  if (federationFetchEndpoint)
    child.ec.subordinate = await getSubordinateStatement(
      federationFetchEndpoint,
      child.ec.entity as string,
      currentNode.ec,
    );

  return updateGraph(currentNode, child, graph);
};

export const discoverMultipleChildren = async (
  entities: string[],
  parent: NodeInfo,
  graph: Graph = { nodes: [], edges: [] },
): Promise<{ graph: Graph; failed: string[] }> => {
  let newGraph = graph;
  const failed: string[] = [];

  for (const entity of entities) {
    try {
      newGraph = await discoverChild(entity, parent, newGraph);
    } catch (e) {
      console.error(e);
      failed.push(entity);
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

  if (federationFetchEndpoint && child)
    child.ec.subordinate = await getSubordinateStatement(
      federationFetchEndpoint,
      child.ec.entity as string,
      discoveredNode.ec,
    );

  const authorityHints = discoveredNode.ec.payload?.authority_hints;

  graph.nodes.push(genNode(discoveredNode));

  if (child) graph = updateGraph(discoveredNode, child, graph);

  if (authorityHints && authorityHints.length > 0) {
    return traverseUp(authorityHints[0], discoveredNode, graph);
  }

  return graph;
};
