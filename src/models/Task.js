import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define(
    "Task",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("waiting", "in_progress", "completed"),
            defaultValue: "waiting",
        },
    },
    {
        tableName: "tasks",
        timestamps: true,
        freezeTableName: true,
    }
);

export default Task;
