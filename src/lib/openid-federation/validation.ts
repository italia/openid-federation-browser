import * as jose from 'jose'
import { EntityConfiguration } from './types';

export const isValidJWT = async (jwt: string, key: jose.JWK) => {    
    try{
        await jose.jwtVerify(jwt, key);
        return true;
    }catch(err){
        return false;
    }
}

export const validateEntityConfiguration = async (ec: EntityConfiguration) => {
    const kid = ec.header.kid;

    if (!kid) return false;

    const key = ec.payload.jwks.keys.find((key) => key.kid === kid);

    if (!key) return false;

    const isValid = await isValidJWT(ec.jwt!, key);

    ec.valid = isValid;

    return isValid;
}