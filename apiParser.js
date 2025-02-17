// express-api-extractor
// This script scans Express.js routes and generates an OpenAPI JSON file with parameters and request bodies

const fs = require('fs');
const path = require('path');
const express = require('express');
const yaml = require('js-yaml');

// Sample Express API file for learning (you'll replace this with your real app files)
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Sample Routes
app.get("/users/:id", (req, res) => {
    res.json({ id: req.params.id, name: "Alice" });
});

app.post("/users", (req, res) => {
    res.status(201).json({ id: 3, name: req.body.name });
});

app.put("/users/:id", (req, res) => {
    res.json({ id: req.params.id, name: req.body.name });
});
app.delete("/users/:id", (req, res) => {
    res.json({ message: "user was deleted"});
})

// Function to extract routes from an Express app
function extractRoutes(app) {
    const openApiSpec = {
        openapi: "3.0.0",
        info: {
            title: "Extracted Express API",
            version: "1.0.0",
        },
        paths: {},
    };

    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            const path = middleware.route.path;
            const methods = Object.keys(middleware.route.methods);

            if (!openApiSpec.paths[path]) {
                openApiSpec.paths[path] = {};
            }

            methods.forEach((method) => {
                const operation = {
                    summary: `Auto-generated ${method.toUpperCase()} ${path}`,
                    responses: {
                        "200": {
                            description: "Success",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                // Extract path parameters
                const paramMatches = path.match(/:\w+/g);
                if (paramMatches) {
                    operation.parameters = paramMatches.map(param => ({
                        name: param.substring(1), // Remove ':'
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    }));
                }

                // Handle request body for POST/PUT methods
                if (method === "post" || method === "put") {
                    operation.requestBody = {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                    },
                                },
                            },
                        },
                    };
                }

                openApiSpec.paths[path][method] = operation;
            });
        }
    });

    return openApiSpec;
}

// Generate OpenAPI JSON
const openApiJson = extractRoutes(app);
fs.writeFileSync("openapi.json", JSON.stringify(openApiJson, null, 2));
console.log("✅ OpenAPI JSON file with parameters and request bodies generated!");
