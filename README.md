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

The stable version of OpenID Federation Browser is usable online [here](https://italia.github.io/openid-federation-browser/packageAuditing)

Snapshot build of the dev version is available [here](https://italia.github.io/openid-federation-browser/main/).

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

## Contributing

We welcome contributions to the OpenID Federation Browser project! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch to your fork.
4. Submit a pull request with a description of your changes.

### Add your Federation in the Assets

Open a PR adding your favorite Trust Anchors [here](src/assets/trustChainList.json).

## License

This project is licensed under the Apache2 License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or support, please contact [gi.demarco@innovazione.gov.it](mailto:gi.demarco@innovazione.gov.it).
