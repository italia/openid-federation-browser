import * as jose from 'jose';
import axios from 'axios';
import { Tree } from '@easygrating/easytree';
import { jsonToPublicKey, mergeObjects } from './utils';
import {
    EntityConfiguration, 
    NodeInfo,
    EntityConfigurationHeader, 
    EntityConfigurationPayload, 
    SubordianteStatement,
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

export const discovery = async (currenECUrl: string): Promise<Tree<NodeInfo>> => {
    const currentNodeEC = await getEntityConfigurations(currenECUrl);
    const federationListEndpoint = currentNodeEC.payload.metadata?.federation_entity?.federation_list_endpoint;

    const nodeInfo: NodeInfo = {ec: currentNodeEC, immDependants: []};

    if (federationListEndpoint){
        const response = await axios.get(federationListEndpoint);
        nodeInfo.immDependants = response.data;
    }

    const currentNode = new Tree(currenECUrl, nodeInfo);
    return currentNode;
};

export const discoverChild = async (currenECUrl: string, parent: Tree<NodeInfo>): Promise<Tree<NodeInfo>> => {
    const currentNode = await discovery(currenECUrl);
    currentNode.parent = parent;
    return currentNode;
};

export const discoverParent = async (currenECUrl: string, child: Tree<NodeInfo>): Promise<Tree<NodeInfo>> => {
    const currentNode = await discovery(currenECUrl);
    currentNode.addChild(child);
    return currentNode;
};

export const traverseUp = async (currenECUrl: string, child: Tree<NodeInfo> | undefined = undefined): Promise<Tree<NodeInfo>> => {
    const currentNode = child 
        ? await discoverParent(currenECUrl, child)
        : await discovery(currenECUrl);

    const authorityHints = currentNode.data.ec.payload?.authority_hints;

    if (authorityHints && authorityHints.length > 0){
        return traverseUp(authorityHints[0], currentNode);
    }

    return currentNode;
};