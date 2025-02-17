# Automated API Documentation Generator

## Overview

This project is an **Automated API Documentation Generator** that scans code and generates **OpenAPI documentation**. It aims to streamline API documentation maintenance by automatically detecting changes and updating documentation accordingly.

## Features

- **Code Parsing**: Reads API routes and extracts relevant metadata.
- **OpenAPI Spec Generation**: Outputs documentation in OpenAPI format.
- **CI/CD Integration**: Automates documentation updates on code changes.
- **Validation**: Ensures OpenAPI compliance before deployment.
- **Deployment Options**: Supports GitHub Pages, Swagger UI, and other hosting solutions.

## Installation

To get started, clone the repository and install dependencies:

```sh
# Clone the repository
git clone https://github.com/your-repo/api-doc-gen.git
cd api-doc-gen

# Install dependencies
npm install  # or pip install -r requirements.txt (if using Python)
```

## Usage

Run the generator script to analyze your API code and generate documentation:

```sh
node generate-docs.js  # Replace with your actual script
```

### Validating OpenAPI Spec

Ensure the generated OpenAPI spec is valid before deployment:

```sh
npx swagger-cli validate openapi.yaml
```

## CI/CD Integration

This project is designed to be used with CI/CD pipelines for automation. Example GitHub Actions workflow:

```

## Roadmap

-

## License
This project is licensed under [MIT License](LICENSE).

---

**Author**: Matthew Sullivan



