// mock-users.js
// This file contains a list of mock users for use in development.

const mockUsers = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com", age: 25, city: "New York", phone: "(555) 123-4567", role: "Admin", active: true },
    { id: 2, name: "Bob Smith", email: "bob.smith@example.com", age: 30, city: "Los Angeles", phone: "(555) 234-5678", role: "User", active: true },
    { id: 3, name: "Charlie Brown", email: "charlie.brown@example.com", age: 28, city: "Chicago", phone: "(555) 345-6789", role: "User", active: false },
    { id: 4, name: "David Lee", email: "david.lee@example.com", age: 35, city: "Houston", phone: "(555) 456-7890", role: "Manager", active: true },
    { id: 5, name: "Eva Davis", email: "eva.davis@example.com", age: 27, city: "San Francisco", phone: "(555) 567-8901", role: "User", active: false },
    { id: 6, name: "Frank White", email: "frank.white@example.com", age: 40, city: "Miami", phone: "(555) 678-9012", role: "Admin", active: true },
    { id: 7, name: "Grace Hall", email: "grace.hall@example.com", age: 23, city: "Seattle", phone: "(555) 789-0123", role: "User", active: true },
    { id: 8, name: "Henry Clark", email: "henry.clark@example.com", age: 31, city: "Boston", phone: "(555) 890-1234", role: "User", active: false },
    { id: 9, name: "Isabel Lewis", email: "isabel.lewis@example.com", age: 29, city: "Denver", phone: "(555) 901-2345", role: "Manager", active: true },
    { id: 10, name: "Jack Wilson", email: "jack.wilson@example.com", age: 26, city: "Dallas", phone: "(555) 012-3456", role: "User", active: true }
];

function getUsers({ search = "", role, city, active, sortBy = "id", order = "asc", page, limit }) {
    let filteredUsers = mockUsers.filter(user =>
        (search ? user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()) : true) &&
        (role ? user.role.toLowerCase() === role.toLowerCase() : true) &&
        (city ? user.city.toLowerCase() === city.toLowerCase() : true) &&
        (active !== undefined ? user.active === (active === "true") : true)
    );

    // Sorting (Default: by ID in ascending order)
    filteredUsers.sort((a, b) => {
        if (!a[sortBy] || !b[sortBy]) return 0; // Prevent errors if field doesn't exist
        return order === "desc" ? (a[sortBy] < b[sortBy] ? 1 : -1) : (a[sortBy] > b[sortBy] ? 1 : -1);
    });

    // Apply pagination only if `page` and `limit` are provided
    if (page && limit) {
        const startIndex = (page - 1) * limit;
        filteredUsers = filteredUsers.slice(startIndex, startIndex + limit);
    }

    return { total: filteredUsers.length, users: filteredUsers };
}


module.exports = { mockUsers, getUsers };