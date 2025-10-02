import assert from "assert";

describe("Openid Federation Browser spec", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit("/");
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("ContextSideBar checks passes", {}, () => {
    cy.visit("http://localhost:5173/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", {
          value: "en-US",
          configurable: true,
        });
      },
    });

    cy.get('[data-testid="input-value"]').type(
      "https://oidc.registry.servizicie.interno.gov.it",
    );

    cy.get('[data-testid="submit-button"]').click();

    cy.wait(1000);

    const graphCanvas = cy.get("canvas").first();
    graphCanvas.should("exist").should("be.visible");

    cy.visit('http://localhost:5173/graphView?node=https%3A%2F%2Foidc.registry.servizicie.interno.gov.it',
      {
        onBeforeLoad(win) {
          Object.defineProperty(win.navigator, "language", {
            value: "en-US",
            configurable: true,
          });
        },
      },
    );

      cy.wait(1000);
      const contextSidebar = cy.get('[data-testid="context-sidebar"]');

      contextSidebar.should("exist");

      const nodeSidebar = contextSidebar.get(
        '[data-testid="node-context-sidebar"]',
      );

      nodeSidebar.should("exist");

      const accordions = cy.get(".accordion-button");

      accordions.should("have.length", 3);

      accordions
        .first()
        .should("have.class", "show")
        .should("contain", "Node Information");

      const nodeInformationAccordionCollapse = nodeSidebar.get(
        ".accordion-collapse",
      );

      nodeInformationAccordionCollapse
        .should("exist")
        .should("be.visible")
        .should("have.class", "show");

      let infoTable = nodeInformationAccordionCollapse.find(".table");

      infoTable
        .should("exist")
        .should("be.visible")
        .should("have.class", "table");

      let tableRows = infoTable.find("tbody tr");

      tableRows.should("have.length", 6);

      tableRows.each((row) => {
        const cells = cy.wrap(row).find("td");
        cells.should("have.length", 2);
      });

      nodeSidebar.get(".accordion-button").first().click();

      //check second accordion

      nodeSidebar.get(".accordion-button").eq(1).click();

      nodeSidebar
        .get(".accordion-button")
        .eq(1)
        .should("exist")
        .should("not.have.class", "show")
        .contains("Immediate Subordinates List");

      //check if the second accordion is collapsed
      nodeSidebar
        .get(".accordion-collapse")
        .eq(1)
        .should("exist")
        .should("not.have.class", "show")
        .should("not.be.visible");

      nodeSidebar.get(".accordion-button").eq(1).click();

      cy.wait(1000);

      //check that entities are listed and visible
      cy.get('[data-testid="entity-item"]')
        .should("exist")
        .should("have.length", 5);

      cy.get('[data-testid="add-remove-entities-button"]')
        .should("exist")
        .should("have.class", "btn btn-sm py-0 px-1 btn-success")
        .should("have.length", 5);

      cy.get('[data-testid="highlight-entities-button"]')
        .should("exist")
        .should("have.class", "btn btn-sm py-0 px-1 btn-primary")
        .should("have.length", 5)
        .should("be.disabled");

      //check that buttons are correctly displayed
      cy.get("#add-all-entities-button")
        .should("exist")
        .should("have.class", "btn btn-sm py-0 px-1 btn-primary")
        .contains("Add all this 5 in page");

      cy.get("#remove-all-entities-button")
        .should("exist")
        .should("have.class", "btn btn-sm py-0 px-1 btn-danger")
        .contains("Remove All");

      cy.get("#add-filtered-entities-button")
        .should("exist")
        .should("have.class", "btn btn-sm py-0 px-1 btn-outline-primary")
        .contains("Add all filtered");

      // check that the nodes are discovered
      cy.get("#add-all-entities-button").click();

      cy.wait(1000);

      cy.get('[data-testid="warning-modal"]')
        .should("exist")
        .should("be.visible");

      cy.get('[data-testid="warning-modal-dismiss-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "btn btn-outline-primary btn-sm")
        .contains("Cancel");

      cy.get('[data-testid="warning-modal-accept-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "btn btn-primary btn-sm")
        .contains("Continue")
        .click();

      cy.get('[data-testid="warning-modal"]').should("be.not.visible");

      cy.wait(8000);

      cy.get("#add-all-entities-button")
        .should("exist")
        .should("be.visible")
        .should("be.disabled")
        .contains("Add all this 0 in page");

      cy.get('[data-testid="add-remove-entities-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "btn btn-sm py-0 px-1 btn-danger")
        .should("have.length", 5);

      cy.get('[data-testid="highlight-entities-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "btn btn-sm py-0 px-1 btn-primary")
        .should("have.length", 5)
        .should("be.not.disabled");

      //check that entity Context menu is correctly handled
      cy.get('[data-testid="highlight-entities-button"]').first().click();

      cy.wait(1000);

      //check the opened entity context menu
      cy.get('[data-testid="context-sidebar"]')
        .should("exist")
        .should("be.visible");

      cy.get(".accordion-button")
        .should("exist")
        .should("be.visible")
        .should("have.length.gte", 4)
        .first()
        .should("have.class", "show")
        .should("contain", "Node Information");

      cy.get(".accordion-collapse")
        .should("exist")
        .should("be.visible")
        .should("have.class", "show");

      infoTable = cy.get(".accordion-collapse").find(".table");

      infoTable
        .should("exist")
        .should("be.visible")
        .should("have.class", "table");

      tableRows = infoTable.find("tbody tr");

      tableRows.should("have.length", 7);

      tableRows.each((row) => {
        const cells = cy.wrap(row).find("td");
        cells.should("have.length", 2);
      });

      cy.get(".accordion-button")
        .eq(1)
        .should("exist")
        .should("be.visible")
        .contains("Authority Hints List")
        .click();

      cy.wait(1000);

      cy.get('[data-testid="add-remove-entities-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.length.gte", 1)
        .should("have.length.lte", 5)
        .first()
        .should("have.class", "btn btn-sm py-0 px-1 btn-danger");

      cy.get(".accordion-button").first().click();

      cy.get(".accordion-button").eq(1).click();

      //check the jwt accordion
      cy.get(".accordion-button").eq(2).click();

      cy.get('[data-testid="schema-validation-table"]')
        .should("exist")
        .should("be.visible")
        .contains("Valid Schema");

      cy.get('[data-testid="schema-validation-table"]')
        .find("tbody tr")
        .should("have.length", 1);

      cy.get('[data-testid="copy-raw-jwt-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "btn btn-primary btn-icon btn-xs py-1 px-1")
        .contains("Copy raw JWT");

      cy.get('[data-testid="jwt-tabs"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "nav nav-tabs auto");

      cy.get('[data-testid="jwt-header-tab"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "nav-link active")
        .contains("Header");

      cy.get('[data-testid="jwt-payload-tab"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "nav-link")
        .contains("Payload");

      cy.get('[data-testid="jwt-header-tab-content"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "tab-pane fade show active");

      cy.get("#entity-configuration-view-nav-payload-tab").click();

      cy.get('[data-testid="jwt-payload-tab-content"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "tab-pane fade active show");

      cy.get(".accordion-button").eq(2).click();

      //check trust marks accordion
      cy.get(".accordion-button")
        .eq(3)
        .should("exist")
        .should("be.visible")
        .contains("Trust Marks")
        .click();

      cy.get('[data-testid="trust-mark"]')
        .should("exist")
        .should("be.visible")
        .should("have.length.gte", 1)
        .first()
        .click();

      cy.get('[data-testid="save-button"]')
        .should("exist")
        .should("be.visible")
        .should(
          "have.class",
          "btn btn-primary btn-sm py-1 px-2 mt-2 _headerText_1hr40_10",
        )
        .contains("Save View")
        .click();

      cy.get("#save-title-modal-input-value")
        .should("exist")
        .should("be.visible")
        .should("have.class", "form-control")
        .type("Cypress view");

      cy.get('[data-testid="modal-dismiss-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "btn btn-outline-primary btn-sm")
        .contains("Cancel");

      cy.get('[data-testid="modal-accept-button"]')
        .should("exist")
        .should("be.visible")
        .should("have.class", "btn btn-primary btn-sm")
        .contains("Save")
        .click();
  });

  it("Restore checks passes", () => {
    cy.visit("http://localhost:5173/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", {
          value: "en-US",
          configurable: true,
        });
      },
    });

    cy.get('[data-testid="restore-session-link"]')
      .should("exist")
      .should("be.visible")
      .click();

    cy.get("#input-value").should("exist").should("have.class", "upload");

    cy.get('[data-testid="restore-upload-button"]')
      .should("exist")
      .should("be.visible")
      .should("have.class", "btn btn-primary btn-sm py-2 px-4")
      .should("have.attr", "disabled");

    cy.get('[data-testid="from-file-tab"]')
      .should("exist")
      .should("be.visible")
      .should("have.class", "nav-link active");

    cy.get('[data-testid="from-previous-tab"]')
      .should("exist")
      .should("be.visible")
      .should("have.class", "nav-link")
      .click();

    cy.get('[data-testid="session-table"]')
      .should("exist")
      .should("be.visible");

    cy.get('[data-testid="session-row"]')
      .should("exist")
      .should("be.visible")
      .should("have.length.gte", 1);

    cy.get('[data-testid="session-name"]')
      .should("exist")
      .should("be.visible")
      .contains("Cypress view");

    cy.get('[data-testid="delete-session-button"]')
      .should("exist")
      .should("be.visible")
      .should("have.class", "btn-icon btn-sm py-0 px-1 btn-danger")
      .contains("Delete");

    cy.get('[data-testid="restore-session-button"]')
      .should("exist")
      .should("be.visible")
      .should("have.class", "btn-icon btn-sm py-0 px-1 btn-success")
      .contains("Restore")
      .click();

    cy.wait(1000);

    cy.get("canvas").first().should("exist").should("be.visible");
  });
});
