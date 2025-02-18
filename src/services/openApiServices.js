function extractRoutes(app) {
    const openApiSpec = {
        openapi: "3.0.0",
        info: {
            title: "Automated API Documentation",
            description: "This API automatically extracts routes from an Express.js application and generates OpenAPI documentation.",
            version: "1.0.0",
            contact: {
                name: "Your Name",
                email: "your.email@example.com",
                url: "https://yourwebsite.com"
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT"
            }
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            },
            {
                url: "https://your-live-api.com",
                description: "Production server"
            }
        ],
        paths: {}
    };
    

    console.log("Extracting API Routes...");

    function processRoute(path, methods) {
        path = path.replace(/\/$/, ""); // Ensure no trailing slash (e.g., "/users/" → "/users")

        if (!openApiSpec.paths[path]) {
            openApiSpec.paths[path] = {};
        }

        methods.forEach((method) => {
            if (!openApiSpec.paths[path][method]) { // Prevent overwriting existing methods
                const operation = {
                    summary: `${method.toUpperCase()} ${path}`,
                    responses: {
                        "200": { description: "Success" },
                        "400": { description: "Bad Request" },
                        "404": { description: "Not Found" },
                        "500": { description: "Internal Server Error" },
                    },
                    parameters: [], // Ensure an empty array to store parameters
                };

                // Add Query Parameters for `GET /users`
                if (method === "get" && path === "/users") {
                    operation.parameters = [
                        { name: "search", in: "query", schema: { type: "string" }, description: "Search users by name or email" },
                        { name: "role", in: "query", schema: { type: "string" }, description: "Filter users by role (Admin, User, etc.)" },
                        { name: "city", in: "query", schema: { type: "string" }, description: "Filter users by city" },
                        { name: "active", in: "query", schema: { type: "boolean" }, description: "Filter users by active status (true/false)" },
                        { name: "sortBy", in: "query", schema: { type: "string", enum: ["id", "name", "email", "age"] }, description: "Sort users by a field" },
                        { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"] }, description: "Sort order (asc/desc)" },
                        { name: "page", in: "query", schema: { type: "integer", minimum: 1 }, description: "Page number for pagination" },
                        { name: "limit", in: "query", schema: { type: "integer", minimum: 1 }, description: "Number of results per page" }
                    ];
                }

                // Extract path parameters (e.g., "/users/:id")
                const paramMatches = path.match(/:\w+/g);
                if (paramMatches) {
                    paramMatches.forEach((param) => {
                        operation.parameters.push({
                            name: param.substring(1), // Remove `:`
                            in: "path",
                            required: true,
                            schema: { type: "string" },
                        });
                    });
                }

                openApiSpec.paths[path][method] = operation;
            }
        });
    }

    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Direct route extraction
            const path = middleware.route.path;
            const methods = Object.keys(middleware.route.methods);
            console.log(`Extracted Route: ${methods.join(", ").toUpperCase()} ${path}`);
            processRoute(path, methods);
        } else if (middleware.name === "router" && middleware.handle.stack) {
            // Handle nested routers (e.g., `app.use('/users', userRoutes)`)
            middleware.handle.stack.forEach((subMiddleware) => {
                if (subMiddleware.route) {
                    let fullPath = middleware.regexp.source
                        .replace("^\\", "/")  // Fix leading slash
                        .replace("\\/?(?=\\/|$)", "")  // Remove unnecessary regex
                        .replace(/\\\//g, "/")  // Normalize slashes
                        .replace("//", "/")  //  Ensure no double slashes

                        + subMiddleware.route.path;

                    fullPath = fullPath.replace(/\/$/, ""); 
                    const methods = Object.keys(subMiddleware.route.methods);
                    console.log(`Extracted Nested Route: ${methods.join(", ").toUpperCase()} ${fullPath}`);
                    processRoute(fullPath, methods);
                }
            });
        }
    });

    console.log(" Final OpenAPI Spec:", JSON.stringify(openApiSpec, null, 2));

    return openApiSpec;
}

module.exports = { extractRoutes };
