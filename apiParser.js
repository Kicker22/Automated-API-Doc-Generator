const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");

const { extractRoutes } = require("./src/services/openApiServices"); //  Fixed Import (ensure correct file name)
const userRoutes = require("./src/routes/users");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.get("/", (req, res) => res.send("Welcome to the API! Navigate to /api-docs for Swagger UI."));
app.use("/users", userRoutes);

//  Function to refresh OpenAPI JSON
function updateOpenApiDocs() {
    console.log("🔄 Updating OpenAPI Documentation...");
    const openApiJson = extractRoutes(app);
    fs.writeFileSync("./src/docs/openapi.json", JSON.stringify(openApiJson, null, 2));
    fs.writeFileSync("./src/docs/openapi.yaml", yaml.stringify(openApiJson));
    console.log(" OpenAPI documentation updated!");
}

//  Auto-refresh OpenAPI when new routes are added
const originalUse = app.use;
app.use = function (...args) {
    originalUse.apply(this, args);
    updateOpenApiDocs();
};

//  Manual OpenAPI refresh endpoint
app.post("/refresh-docs", (req, res) => {
    try {
        updateOpenApiDocs();
        res.json({ message: "OpenAPI documentation refreshed successfully!" });
    } catch (error) {
        console.error("Error refreshing OpenAPI documentation:", error);
        res.status(500).json({ error: "Failed to refresh OpenAPI documentation" });
    }
});

//  Swagger UI - Ensures latest OpenAPI JSON is always loaded
app.use("/api-docs", swaggerUi.serve, async (req, res, next) => {
    try {
        const swaggerDocument = JSON.parse(fs.readFileSync("./src/docs/openapi.json", "utf8"));
        return swaggerUi.setup(swaggerDocument, {
            explorer: true, //  Adds a search bar for easier navigation
            customCss: `
                .topbar-wrapper img {content: url('https://your-logo-url.com/logo.png'); height: 40px;}
                .swagger-ui .topbar { background-color: #1e3a8a; }  /* Custom color */
            `,
            customSiteTitle: "Express API Docs",
            customfavIcon: "https://your-favicon-url.com/favicon.ico",
        })(req, res, next);
    } catch (error) {
        console.error("Error loading Swagger document:", error);
        res.status(500).json({ error: "Failed to load Swagger UI" });
    }
});



if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(` Server running at http://localhost:${PORT}`);
        console.log(` Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
}

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//     console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
// });
module.exports = app; // ✅ Supertest will now work correctly
