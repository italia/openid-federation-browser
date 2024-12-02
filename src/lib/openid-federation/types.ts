import jose from 'jose';
import { Tree } from '@easygrating/easytree';

export interface SubordianteStatement {
    exp: number;
    iat: number;
    iss: string;
    sub: string;
    source_endpoint: string;
    jwks: {
        keys: jose.JWK[];
    };
    metadata_policy: {
        openid_provider: {
            contacts: {
                add: string[];
            };
            organization_name: {
                value: string;
            };
            subject_types_supported: {
                value: string[];
            };
            token_endpoint_auth_methods_supported: {
                default: string[];
                subset_of: string[];
                superset_of: string[];
            };
        };
    };
};

export interface EntityConfigurationHeader {
    alg: string;
    typ: string;
    kid: string;
};

export interface EntityConfigurationPayload {
    iss: string;
    sub: string;
    iat: number;
    exp: number;
    metadata: {
        federation_entity: {
            contacts: string[];
            federation_fetch_endpoint: string;
            homepage_uri: string;
            organization_name: string;
            federation_list_endpoint: string;
        };
        openid_provider: {
            issuer: string;
            signed_jwks_uri: string;
            authorization_endpoint: string;
            client_registration_types_supported: string[];
            grant_types_supported: string[];
            id_token_signing_alg_values_supported: string[];
            logo_uri: string;
            op_policy_uri: string;
            response_types_supported: string[];
            subject_types_supported: string[];
            token_endpoint: string;
            federation_registration_endpoint: string;
            token_endpoint_auth_methods_supported: string[];
        };
    };
    jwks: {
        keys: jose.JWK[];
    };
    authority_hints: string[] | undefined;
};

export interface EntityConfiguration {
    entity: string;
    jwt?: string;
    header?: EntityConfigurationHeader;
    payload?: EntityConfigurationPayload;
    subordinate?: SubordianteStatement | undefined;
    startNode?: boolean;
};

export interface NodeInfo {
    ec: EntityConfiguration;
    immDependants: string[];
    startNode?: boolean;
}

type MetadataValue = string | string[] | {[key: string]: string;};
export type Metadata = {[key: string]: MetadataValue};