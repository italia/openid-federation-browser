import { Tree } from '@easygrating/easytree';
import { NodeInfo } from '../openid-federation/types';
import { hasAuthorityHints, hasFetchEndpoint } from "../openid-federation/utils";
import { NodeType } from './types';

export const getNodeType = (tree: Tree<NodeInfo>): NodeType => {
    if (tree.data.startNode){
        return NodeType.StartNode;
    }

    if (!tree.data.ec.jwt){
        return NodeType.Undiscovered;
    }

    if (!hasFetchEndpoint(tree.data.ec.payload)){
        return NodeType.Leaf;
    }

    if (hasAuthorityHints(tree.data.ec.payload)){
        return NodeType.Intermediate;
    }

    return NodeType.Anchor;
};

export const isEdge = (elm: any) => elm.hasOwnProperty("source") && elm.hasOwnProperty("target");
export const isNode = (elm: any) => !isEdge(elm);