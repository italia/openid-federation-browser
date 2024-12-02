import * as jose from 'jose';
import { Tree } from '@easygrating/easytree';
import { NodeInfo } from './types';

export const jsonToPublicKey = (jwk: JsonWebKey) => {
    if (jwk.kty === 'RSA') {
      return {
        kty: jwk.kty,
        key_ops: jwk.key_ops,
        n: jwk.n,
        e: jwk.e,
        alg: jwk.alg,
      } as jose.JWK;
    }
    else if (jwk.kty === 'EC') {
      return {
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
    const isOject = (obj: any) => obj && typeof obj === 'object';

    const output = Object.assign({}, objectTarget);
    if (isOject(objectTarget) && isOject(objectSource)) {
        Object.keys(objectSource).forEach(key => {
            if (isOject(objectSource[key])) {
                if (!(key in objectTarget)) Object.assign(output, { [key]: objectSource[key] });
                else output[key] = mergeObjects(objectTarget[key], objectSource[key]);
            } else {
                Object.assign(output, { [key]: objectSource[key] });
            }
        });
    }
    return output;
};

export const getTreeRoot = (tree: Tree<NodeInfo>): Tree<NodeInfo> => {
  return tree.parent ? getTreeRoot(tree.parent) : tree;
}