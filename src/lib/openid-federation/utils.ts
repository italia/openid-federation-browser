import * as jose from "jose";
import { NodeInfo, EntityConfigurationPayload, EntityType } from "./types";

export const jsonToPublicKey = (jwk: { [key: string]: string | string[] }) => {
  if (jwk.kty === "RSA") {
    return {
      kid: jwk.kid,
      kty: jwk.kty,
      key_ops: jwk.key_ops,
      n: jwk.n,
      e: jwk.e,
      alg: jwk.alg,
    } as jose.JWK;
  } else if (jwk.kty === "EC") {
    return {
      kid: jwk.kid,
      kty: jwk.kty,
      key_ops: jwk.key_ops,
      x: jwk.x,
      y: jwk.y,
      crv: jwk.crv,
      alg: jwk.alg,
    } as jose.JWK;
  }

  throw new Error(`Unsupported key type ${jwk.kty}`);
};

export const getFetchEndpoint = (payload: EntityConfigurationPayload) =>
  payload.metadata?.federation_entity?.federation_fetch_endpoint;
export const hasFetchEndpoint = (payload: EntityConfigurationPayload) =>
  getFetchEndpoint(payload) ? true : false;
export const getAuthorityHints = (payload: EntityConfigurationPayload) =>
  payload.authority_hints;
export const hasAuthorityHints = (payload: EntityConfigurationPayload) =>
  getAuthorityHints(payload);
export const getEntityTypes = (payload: EntityConfigurationPayload) =>
  Object.keys(payload.metadata);

export const setEntityType = (info: NodeInfo): void => {
  if (!hasFetchEndpoint(info.ec.payload)) {
    info.type = EntityType.Leaf;
    return;
  }

  if (hasAuthorityHints(info.ec.payload)) {
    info.type = EntityType.Intermediate;
    return;
  }

  info.type = EntityType.Anchor;
};

export const checkViewValidity = (view: {
  nodes: string[];
  edges: { source: string; target: string }[];
}): boolean => {
  if (!view) return false;
  if (!Object.hasOwnProperty.call(view, "nodes")) return false;
  if (!Object.hasOwnProperty.call(view, "edges")) return false;

  const notString = view.nodes.find((node) => typeof node !== "string");
  if (notString) return false;

  const notStringEdge = view.edges.find(
    (edge) =>
      typeof edge.source !== "string" || typeof edge.target !== "string",
  );

  if (notStringEdge) return false;

  return true;
};
