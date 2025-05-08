import assert from "assert";

describe('ContextSideBar spec', () => {
  it('ContextSideBar checks passes', () => {
    cy.visit('http://localhost:5173/');

    cy.get('[data-testid="input-value"]')
      .type('https://oidc.registry.servizicie.interno.gov.it');

    cy.get('[data-testid="submit-button"]')
      .click();

    cy.wait(1000);

    const graphCanvas = cy.get('canvas').first();
    graphCanvas
      .should('exist')
      .should('be.visible');

    graphCanvas.then($canvas => {
        const canvasWidth = $canvas.width() || 0;
        const canvasHeight = $canvas.height() || 0;

        const canvasCenterX = canvasWidth / 2;
        const canvasCenterY = canvasHeight / 2;

        cy.wrap($canvas)
          .rightclick(canvasCenterX, canvasCenterY, { multiple: true });
    });

    cy.wait(1000);
    const contextSidebar = cy.get('[data-testid="context-sidebar"]');
      
    contextSidebar
      .should('exist')
      .should('be.visible');

    const nodeSidebar = contextSidebar.get('[data-testid="node-context-sidebar"]');

    nodeSidebar
      .should('exist')
      .should('be.visible');

    const accordions = nodeSidebar.get('.accordion-button');

    accordions
      .should('have.length', 3);

    accordions
      .first()
      .should('have.class', 'show')
      .should('contain', 'Node Information');

    const nodeInformationAccordionCollapse = 
      nodeSidebar
        .get('.accordion-collapse');

    nodeInformationAccordionCollapse
      .should('exist')
      .should('be.visible')
      .should('have.class', 'show');

    const infoTable = nodeInformationAccordionCollapse
      .find('.table');

    infoTable
      .should('exist')
      .should('be.visible')
      .should('have.class', 'table');

    const tableRows = infoTable
      .find('tbody tr');

    tableRows
      .should('have.length', 6);

    tableRows.each((row) => {
      const cells = cy.wrap(row).find('td');
      cells
        .should('have.length', 2);
    });

    nodeSidebar
      .get('.accordion-button')
      .first()
      .click();

      nodeSidebar
      .get('.accordion-collapse')
      .first()
      .should('not.have.class', 'show');

    //check second accordion
    nodeSidebar
      .get('.accordion-button')
      .eq(1)
      .should('exist')
      .should('be.visible')
      .should('not.have.class', 'show')
      .contains('Immediate Subordinates List');

    //check if the second accordion is collapsed
    nodeSidebar
      .get('.accordion-collapse')
      .eq(1)
      .should('exist')
      .should('not.have.class', 'show')
      .should('not.be.visible');

    nodeSidebar
      .get('.accordion-button')
      .eq(1)
      .click();

    cy.wait(1000);

    //check that entities are listed and visible
    cy.get('[data-testid="entity-item"]')
      .should('exist')
      .should('be.visible')
      .should('have.length', 5);

    cy.get('[data-testid="add-remove-entities-button"]')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-sm py-0 px-1 btn-success')
      .should('have.length', 5);

    cy.get('[data-testid="highlight-entities-button"]')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-sm py-0 px-1 btn-primary')
      .should('have.length', 5)
      .should('be.disabled');

    //check that buttons are correctly displayed
    cy.get('#add-all-entities-button')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-sm py-0 px-1 btn-primary')
      .contains('Add all this 5 in page');

    cy.get('#remove-all-entities-button')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-sm py-0 px-1 btn-danger')
      .contains('Remove All');

    cy.get('#add-filtered-entities-button')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-sm py-0 px-1 btn-outline-primary')
      .contains('Add all filtered');

    // check that the nodes are discovered
    cy.get('#add-all-entities-button')
      .click();

    cy.wait(1000);

    cy.get('[data-testid="warning-modal"]')
      .should('exist')
      .should('be.visible');

    cy.get('[data-testid="warning-modal-dismiss-button"]')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-outline-primary btn-sm')
      .contains('Cancel');

    cy.get('[data-testid="warning-modal-accept-button"]')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-primary btn-sm')
      .contains('Continue')
      .click();

    cy.get('[data-testid="warning-modal"]')
      .should('be.not.visible');

    cy.wait(5000);

    cy.get('#add-all-entities-button')
      .should('exist')
      .should('be.visible')
      .should('be.disabled')
      .contains('Add all this 0 in page');

    cy.get('[data-testid="add-remove-entities-button"]')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-sm py-0 px-1 btn-danger')
      .should('have.length', 5);

    cy.get('[data-testid="highlight-entities-button"]')
      .should('exist')
      .should('be.visible')
      .should('have.class', 'btn btn-sm py-0 px-1 btn-primary')
      .should('have.length', 5)
      .should('be.not.disabled');

    cy.get('[data-testid="highlight-entities-button"]')
      .first()
      .click();

    cy.wait(1000);
  });
});