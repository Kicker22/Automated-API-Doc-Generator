const { getUsers } = require("../modles/mockUsers");

exports.getAllUsers = (req, res) => {
    const { search, role, city, active, sortBy, order, page, limit } = req.query;

    //Convert `page` and `limit` to numbers only if they exist
    const pageNum = page ? Number(page) : undefined;
    const limitNum = limit ? Number(limit) : undefined;

    const usersData = getUsers({ search, role, city, active, sortBy, order, page: pageNum, limit: limitNum });

    res.json(usersData);
};

exports.createUser = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.age) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    res.status(201).json({ id: Date.now(), ...req.body });
};

exports.updateUser = (req, res) => {
    res.json({ id: req.params.id, ...req.body });
};

exports.deleteUser = (req, res) => {
    res.json({ message: `User ${req.params.id} was deleted` });
};
