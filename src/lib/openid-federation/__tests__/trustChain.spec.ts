import { discovery } from "../trustChain";

describe('testing openid-federation package', () => {
    test('should create a valid TrustChain', async () => {
        const trustChain = await discovery("https://comune.vado-ligure.sv.it");
        expect(trustChain).toBeDefined();
        expect(trustChain.tree).toBeDefined();
        expect(trustChain.metadata).toBeDefined();
        expect(trustChain.tree.id).toBe("https://preprod.oidc.registry.servizicie.interno.gov.it");
        expect(trustChain.tree.data.jwt).toBeDefined();
        expect(trustChain.tree.children.length).toBe(355);
    });
});