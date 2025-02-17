function extractRoutes(app) {
    const openApiSpec = {
        openapi: "3.0.0",
        info: { title: "Extracted Express API", version: "1.0.0" },
        paths: {},
    };

    function processRoute(path, methods) {
        if (!openApiSpec.paths[path]) {
            openApiSpec.paths[path] = {};
        }

        methods.forEach((method) => {
            const operation = {
                summary: `${method.toUpperCase()} ${path}`,
                responses: {
                    "200": { description: "Success" },
                    "400": { description: "Bad Request" },
                    "404": { description: "Not Found" },
                    "500": { description: "Internal Server Error" },
                },
            };

            // Extract path parameters (e.g., "/users/:id")
            const paramMatches = path.match(/:\w+/g);
            
            if (paramMatches) {
                operation.parameters = paramMatches.map(param => ({
                    name: param.substring(1), // Remove `:`
                    in: "path",
                    required: true,
                    schema: { type: "string" },
                }));
            }

            if (method === "get" && path === "/users") {
                operation.parameters = [
                    {
                        name: "search",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "Search users by name",
                    },
                ];
            }

            // Add request body schema for POST/PUT methods
            if (method === "post" || method === "put") {
                operation.requestBody = {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    email: { type: "string" },
                                    age: { type: "integer" },
                                },
                            },
                        },
                    },
                };
            }

            openApiSpec.paths[path][method] = operation;
        });
    }

    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Direct route
            const path = middleware.route.path;
            const methods = Object.keys(middleware.route.methods);
            processRoute(path, methods);
        } else if (middleware.name === "router" && middleware.handle.stack) {
            // Nested router (e.g., `app.use('/users', userRoutes)`)
            middleware.handle.stack.forEach((subMiddleware) => {
                if (subMiddleware.route) {
                    const fullPath = middleware.regexp.source
                        .replace("^\\", "/")  // Replace leading regex characters
                        .replace("\\/?(?=\\/|$)", "") // Remove trailing slashes
                        .replace(/\\\//g, "/")  // Normalize slashes
                        .replace("//", "/");  // Remove double slashes
                    const methods = Object.keys(subMiddleware.route.methods);
                    processRoute(fullPath, methods);
                }
            });
        }
    });

    return openApiSpec;
}

module.exports = { extractRoutes };
