import * as jose from "jose";
import { Tree } from "@easygrating/easytree";
import { NodeInfo, EntityConfigurationPayload, EntityType } from "./types";

export const jsonToPublicKey = (jwk: { [key: string]: any }) => {
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

export const mergeObjects = (objectTarget: any, objectSource: any) => {
  const isOject = (obj: any) => obj && typeof obj === "object";

  const output = Object.assign({}, objectTarget);
  if (isOject(objectTarget) && isOject(objectSource)) {
    Object.keys(objectSource).forEach((key) => {
      if (isOject(objectSource[key])) {
        if (!(key in objectTarget))
          Object.assign(output, { [key]: objectSource[key] });
        else output[key] = mergeObjects(objectTarget[key], objectSource[key]);
      } else {
        Object.assign(output, { [key]: objectSource[key] });
      }
    });
  }
  return output;
};

export const getTreeRoot = (tree: Tree<NodeInfo>): Tree<NodeInfo> =>
  tree.parent ? getTreeRoot(tree.parent) : tree;
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
