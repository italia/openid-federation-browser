import * as jose from 'jose'
import { EntityConfiguration } from './types';

const isValidJWT = async (jwt: string, key: jose.JWK) => {    
    try{
        await jose.jwtVerify(jwt, key);
        return true;
    }catch(err){
        return false;
    }
};

export const isExpired = (ec: EntityConfiguration) => ec.payload.exp < Date.now() / 1000;

export const validateEntityConfiguration = async (ec: EntityConfiguration) => {
    const kid = ec.header.kid;

    if (!kid) return false;

    const key = ec.payload.jwks.keys.find((key) => key.kid === kid);

    if (!key) return false;

    const isJWTValid = await isValidJWT(ec.jwt!, key);
    const expired = isExpired(ec);

    ec.valid = isJWTValid && !expired;

    if (!isJWTValid || !expired) ec.invalidReason = 
        `${isJWTValid ? 'Invalid JWT' : ''} ${isJWTValid || !expired ? ';' : ''} ${!expired ? 'Expired' : ''}`;

    return isJWTValid && !expired;
};