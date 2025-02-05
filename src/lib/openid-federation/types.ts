import jose from "jose";

export interface JWTHeader {
  alg: string;
  typ: string;
  kid: string;
}

export interface SubordinateStatementPayload {
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
}

export interface SubordianteStatement {
  jwt: string;
  header: JWTHeader;
  payload: SubordinateStatementPayload;
  valid: boolean;
  invalidReason?: string;
}

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
      federation_trust_mark_list_endpoint?: string;
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
  trust_marks: Record<string, string>[] | undefined;
}

export interface EntityConfiguration {
  entity: string;
  jwt: string;
  header: JWTHeader;
  payload: EntityConfigurationPayload;
  valid: boolean;
  invalidReason?: string;
  subordinates: Record<string, SubordianteStatement>;
  startNode?: boolean;
}

export interface NodeInfo {
  ec: EntityConfiguration;
  immDependants: string[];
  startNode?: boolean;
  type: EntityType;
  trustMarks?: {
    id: string;
    header: Record<string, string>;
    payload: Record<string, string | Record<string, string>>;
    jwt: string;
  }[];
}

type MetadataValue = string | string[] | { [key: string]: string };
export type Metadata = { [key: string]: MetadataValue };

export enum EntityType {
  Anchor = "Trust Anchor",
  Intermediate = "Intermediate",
  Leaf = "Leaf",
  StartNode = "StartNode",
  Undiscovered = "Undiscovered",
}
