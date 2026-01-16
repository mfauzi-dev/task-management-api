import Role from "./Role.js";
import Task from "./Task.js";
import User from "./User.js";

// User - Role
Role.hasMany(User, {
    foreignKey: "roleId",
    onDelete: "cascade",
});

User.belongsTo(Role, {
    foreignKey: "roleId",
    as: "role",
});

// User - Task
User.hasMany(Task, {
    foreignKey: "userId",
    onDelete: "cascade",
});
Task.belongsTo(User, {
    foreignKey: "userId",
    as: "owner",
});

export { Role, User, Task };
