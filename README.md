# OpenID Federation Browser

Welcome to the OpenID Federation Browser project!

This tool is designed to facilitate the exploration and management of trust infrastructures based on [OpenID Federation 1.0](https://openid.net/specs/openid-federation-1_0.html),
providing a user-friendly interface for navigating Trust Chains and Entity Configurations.

<img src="images/preview.gif" width="768">

## Features

- **Entity Discovery**: Easily discover and view OpenID Federation Entities and their configurations.
- **Trust Chain Visualization**: Visualize the Trust Chains between entities, including Trust Anchors, Intermediates, and Leaves.
- **Graph View Save, Export and Import**: Produce the representation of your network, save locally or export it. You can also import it in offline mode.
- **Security Insights**: Gain insights into the security aspects of the federation, including trust marks and compliance status.

## Online Builds

The stable version of OpenID Federation Browser is usable online [here](https://italia.github.io/openid-federation-browser/main)

Snapshot build of the dev version is available [here](https://italia.github.io/openid-federation-browser/dev/).

Please remember to bypass CORS restrictions using a web browser addon or proxy before using it. See [here](https://github.com/italia/openid-federation-browser/blob/main/SETUP.md#cors-restriction) to learn how to do.

## Installation

To install and run the OpenID Federation Browser, follow these steps documented in [here](SETUP.md).

## Usage

- **Configure the Trust Anchor**: Submit the https URL of the Trust Anchor to use and optionally its Federation Entity Keys in JWK format.
- **Browse Subordinates**: inspect the Entities listed in the Federation Listing Endpoint and find Leaves and Intermediates.
- **Filter Subordinates**: filter results using regexp on the entity IDs or Federation Listing url params filters.
- **Discover Entities**: Submit a specific entity id to be resolved under the configured Trust Anchor.
- **Inspect Entity Statements**: inspect Entity Configuration by clicking an Entity, Subordinate Statements by clicking the wire connecting an Entity with its Superior.
- **Export Trust Chains**: By selecting a specific Entity, download the validated Trust Chain.
- **Security Checks**: Inspect specific Trust Marks associated with each entity.

## How to Contribute

We welcome contributions to the OpenID Federation Browser project! Here’s how you can get involved:

### JSON Schema Updates

The project uses JSON schemas to inspect entities. If you want to contribute to the schema definitions, you can find the current schemas here:

- [Schema.ts](https://github.com/italia/openid-federation-browser/blob/db5efe73ca4ae0ae8c8a1189e1c415718c9357d4/src/lib/openid-federation/schema.ts#L4)
- [Entity Configuration Schema](https://github.com/italia/openid-federation-browser/blob/db5efe73ca4ae0ae8c8a1189e1c415718c9357d4/src/lib/openid-federation/schemas/entityConfiguration.schema.json#L4)
- [Subordinate Statement Schema](https://github.com/italia/openid-federation-browser/blob/db5efe73ca4ae0ae8c8a1189e1c415718c9357d4/src/lib/openid-federation/schemas/subordinateStatement.schema.json#L4)

Feel free to propose changes or improvements by opening a Pull Request (PR).

### Localization

We support localization and you can help by adding or updating translations. To add Swedish localization, create a `sv.json` file based on the existing [English localization file](https://github.com/italia/openid-federation-browser/blob/db5efe73ca4ae0ae8c8a1189e1c415718c9357d4/src/assets/localization/en.json#L4) and submit it via a PR. Additionally, update the [translations.ts file](https://github.com/italia/openid-federation-browser/blob/db5efe73ca4ae0ae8c8a1189e1c415718c9357d4/src/lib/translations.ts#L4) to include the new language.

### Trust Anchor List

The trust anchor list is an important part of the OpenID Federation Browser distribution. If you have updates or additions to the trust anchor list, please update the [trustChainList.json file](https://github.com/italia/openid-federation-browser/blob/db5efe73ca4ae0ae8c8a1189e1c415718c9357d4/src/assets/trustChainList.json#L4) and submit your changes via a PR.

### General Contribution Guidelines

1. **Fork the Repository**: Start by forking the repository to your GitHub account.
2. **Clone Your Fork**: Clone your forked repository to your local machine.
3. **Create a Branch**: Create a new branch for your feature or bug fix.
4. **Make Changes**: Implement your changes in the codebase.
5. **Commit Your Changes**: Make sure to write clear and concise commit messages.
6. **Push to GitHub**: Push your changes to your forked repository.
7. **Open a Pull Request**: Navigate to the original repository and open a pull request with a description of your changes. 

We appreciate your contributions and look forward to collaborating with you!

### Add your Federation in the Assets

Open a PR adding your favorite Trust Anchors [here](src/assets/trustChainList.json).

## License

This project is licensed under the Apache2 License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or support, please contact [gi.demarco@innovazione.gov.it](mailto:gi.demarco@innovazione.gov.it).
