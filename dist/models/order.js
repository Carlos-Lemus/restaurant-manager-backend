"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = require("../db/connection");
const employee_1 = __importDefault(require("./employee"));
const order_detail_1 = __importDefault(require("./order-detail"));
const table_1 = __importDefault(require("./table"));
class Order extends sequelize_1.Model {
}
Order.init({
    idOrden: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idEmpleado: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    idComercial: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    idMesa: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    nombreCliente: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    fechaOrden: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    done: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    },
    pagado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    modelName: 'order',
    timestamps: true,
    sequelize: connection_1.sequelizeConnection,
    paranoid: true
});
Order.hasMany(order_detail_1.default, {
    foreignKey: 'idOrden'
});
Order.belongsTo(employee_1.default, {
    foreignKey: 'idEmpleado'
});
Order.belongsTo(table_1.default, {
    foreignKey: 'idMesa'
});
exports.default = Order;
//# sourceMappingURL=order.js.map