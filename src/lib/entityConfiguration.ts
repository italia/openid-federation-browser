import * as jose from 'jose'
import { VerifyCallback } from '@openid-federation/core/src/utils';

const jsonWebKeyToPublicKey = (jwk: JsonWebKey) => {
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
}

export const verifyJwtCallback: VerifyCallback = async ({ signature, data, jwk }) => {    
    const key = await jose.importJWK(jsonWebKeyToPublicKey(jwk));

    try{
        await jose.jwtVerify(signature, key);
        return true;
    }catch(err){
        return false;
    }
}