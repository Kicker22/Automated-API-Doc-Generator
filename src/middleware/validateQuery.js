const { query, validationResult } = require("express-validator");

const validateUserQuery = [
    query("search").optional().isString().withMessage("Search must be a string"),
    query("role").optional().isString().withMessage("Role must be a string"),
    query("city").optional().isString().withMessage("City must be a string"),
    query("active").optional().isBoolean().withMessage("Active must be true or false"),
    query("sortBy").optional().isIn(["id", "name", "email", "age"]).withMessage("Invalid sortBy field"),
    query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateUserQuery };
