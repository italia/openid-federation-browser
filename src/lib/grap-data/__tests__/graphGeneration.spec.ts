import { genGraphFromUrl } from "../graphGeneration";

describe('testing openid-federation package', () => {
    test('should create a valid TrustChain', async () => {
        const graph = await genGraphFromUrl("https://comune.vado-ligure.sv.it");
        expect(graph).toBeDefined();
        console.log(graph);
        expect(graph.nodes.length).toHaveLength(356);
        expect(graph.edges.length).toHaveLength(355);
    });
});