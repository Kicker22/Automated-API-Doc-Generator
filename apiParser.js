const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");

//initialize express app
const app = express();

const { extractRoutes } = require("./src/services/openApiServices"); // ✅ Path updated
const userRoutes = require("./src/routes/users"); // ✅ Path updated
app.use("/users", userRoutes);



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.get("/", (req, res) => res.send("Welcome to the API! Navigate to /api-docs for Swagger UI."));

// Extract OpenAPI Documentation
try {
    const openApiJson = extractRoutes(app);
    fs.writeFileSync("./src/docs/openapi.json", JSON.stringify(openApiJson, null, 2));
    fs.writeFileSync("./src/docs/openapi.yaml", yaml.stringify(openApiJson, 4));
} catch (error) {
    console.error("Error extracting OpenAPI documentation:", error);
}

// Load Swagger UI
try {
    const swaggerDocument = require("./src/docs/openapi.json"); // ✅ Path updated
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.error("Error loading Swagger document:", error);
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📄 Swagger UI available at http://localhost:${PORT}/api-docs`);
});