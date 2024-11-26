import * as jose from 'jose';
import axios from 'axios';
import { Tree } from '@easygrating/easytree';
import { jsonToPublicKey, mergeObjects } from './utils';
import {
    EntityConfiguration, 
    EntityConfigurationHeader, 
    EntityConfigurationPayload, 
    SubordianteStatement,
    TrustChain,
} from './types';


const getSubordinateStatement = async (source_endpoint: string): Promise<SubordianteStatement> => {
    const response = await axios.get(source_endpoint);
    const decodedPayload  = jose.decodeJwt(response.data) as SubordianteStatement;
    decodedPayload.jwks.keys = decodedPayload.jwks.keys.map((jwk) => jsonToPublicKey(jwk));

    return decodedPayload;
};

const getEntityConfigurations = async (subject: string, wellKnownEndpoint: string = ".well-known/openid-federation"): Promise<EntityConfiguration> => {
    const subjectWellKnown = subject.endsWith("/") ? subject : subject + "/";
    
    const {data: jwt} = await axios.get(subjectWellKnown + wellKnownEndpoint);

    const header = jose.decodeProtectedHeader(jwt) as EntityConfigurationHeader;
    const payload  = jose.decodeJwt(jwt) as EntityConfigurationPayload;
    payload.jwks.keys = payload.jwks.keys.map((jwk) => jsonToPublicKey(jwk));

    const federationFetchEndpoint = payload.metadata?.federation_entity?.federation_fetch_endpoint;

    if (federationFetchEndpoint){
        const subordinate = await getSubordinateStatement(federationFetchEndpoint);
        return {entity: subject, jwt, header: header, payload, subordinate: subordinate};
    }

    return {entity: subject, jwt, header: header, payload};
};

const discoveryStep = async (currenECUrl: string, prec: Tree<EntityConfiguration> | undefined = undefined): Promise<Tree<EntityConfiguration>> => {
    const currentNodeEC = await getEntityConfigurations(currenECUrl);
    const currentNode = new Tree(currenECUrl, currentNodeEC);

    if (prec) currentNode.addChild(prec);
    else currentNode.data.startNode = true;

    const federationListEndpoint = currentNode.data.payload?.metadata?.federation_entity?.federation_list_endpoint;

    if (federationListEndpoint){
        const response = await axios.get(federationListEndpoint);
        const federationList: Set<string> = new Set(response.data);
        
        federationList.forEach(async (child) => {
            currentNode.addChild(new Tree(child, {entity: child}));
        });
        
    }

    return currentNode;
};

export const discovery = async (currenECUrl: string, prec: Tree<EntityConfiguration> | undefined = undefined): Promise<TrustChain> => {
    const currentNode = await discoveryStep(currenECUrl, prec);

    const authorityHints = currentNode.data.payload?.authority_hints;

    if (authorityHints && authorityHints.length > 0){
        return discovery(authorityHints[0], currentNode);
    }

    return {tree: currentNode, metadata: {}};
};
