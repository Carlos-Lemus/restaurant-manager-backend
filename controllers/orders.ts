import { Request, Response } from "express";
import { Server } from "socket.io";
import { Order, Employee, MenuItem, OrderDetail, Table } from "../models";

const OrderAttributes: string[] = ['idOrden', 'idComercial', 'nombreCliente', 'fechaOrden', 'done', 'pagado'];
const OrderDetialAttributes: string[] = ['idOrderDetail', 'cantidad', 'importe', 'comentario', 'done'];
const menuItemAttributes: string[] = ['id_menu_item', "idCategoria", 'nombre_item', 'precio', 'disponibilidad', 'detalles_item', 'descuento', 'url'];
const employeeAttributes: string[] = ['idEmpleado', 'nombre', 'apellido'];
const tableAttributes: string[] = ['idMesa', 'numero'];

// API REST CONTROLLER

const getOrdersUndone = async (req: Request, res: Response): Promise<Response> => {

    try {

        const Orders = await Order.findAll({
            where: {
                done: false,
                idComercial: 1,
                deletedAt: null
            },
            attributes: OrderAttributes,
            include: [{
                model: OrderDetail, attributes: OrderDetialAttributes, include: [{
                    model: MenuItem, attributes: menuItemAttributes
                }]
            }, {
                model: Employee,
                attributes: employeeAttributes
            }, {
                model: Table,
                attributes: tableAttributes
            }]
        });

        return res.json({
            ok: true,
            collection: {
                hasItems: Orders.length > 0 ? true : false,
                items: Orders,
            }
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false
        });
    }

}

const getOrdersWithoutPaying = async (req: Request, res: Response): Promise<Response> => {

    try {

        const Orders = await Order.findAll({
            where: {
                done: true,
                pagado: false,
                idComercial: 1,
                deletedAt: null
            },
            attributes: OrderAttributes,
            include: [{
                model: OrderDetail, attributes: OrderDetialAttributes, include: [{
                    model: MenuItem, attributes: menuItemAttributes
                }]
            }, {
                model: Employee,
                attributes: employeeAttributes
            }, {
                model: Table,
                attributes: tableAttributes
            }]
        });

        return res.json({
            ok: true,
            collection: {
                hasItems: Orders.length > 0 ? true : false,
                items: Orders,
            }
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false
        });
    }

}

const getOrder = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {

        const order = await Order.findOne({
            where: {
                idOrden: id
            },
            attributes: OrderAttributes,
            include: [{
                model: OrderDetail, attributes: OrderDetialAttributes, include: [{
                    model: MenuItem, attributes: menuItemAttributes
                }]
            }, {
                model: Employee,
                attributes: employeeAttributes
            }, {
                model: Table,
                attributes: tableAttributes
            }]
        })

        return res.json({
            ok: true,
            order
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false
        });
    }

}

const createOrder = async (req: Request, res: Response): Promise<Response> => {

    const payload = req.body;

    try {

        let payman_order_details = [...payload.order_details];

        delete payload.order_details;

        const { idOrden }: Order = await Order.create(payload);

        payman_order_details = payman_order_details.map(({ ...props }) => ({
            ...props,
            idOrden
        }));

        await OrderDetail.bulkCreate(payman_order_details);

        const order = await Order.findOne({
            where: {
                idOrden,
            },
            attributes: OrderAttributes,
            include: [{
                model: OrderDetail, attributes: OrderDetialAttributes, include: [{
                    model: MenuItem, attributes: menuItemAttributes
                }]
            }, {
                model: Employee,
                attributes: employeeAttributes
            }, {
                model: Table,
                attributes: tableAttributes
            }]
        });


        return res.json({
            ok: true,
            order
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false
        });
    }

}

const updateOrder = async (req: Request, res: Response): Promise<Response> => {

    try {
        const { id } = req.params;
        const { newMenuItems, itemsMenuEdit, itemsMenuRemove, ...payload } = req.body;

        const order = await Order.findByPk(id);

        await order?.update({ ...payload, done: !order.done });

        await OrderDetail.bulkCreate(newMenuItems);

        await OrderDetail.destroy({
            where: {
                idOrden: id,
                id_menu_item: itemsMenuRemove
            }
        });

        for (const itemOrderUpdate of itemsMenuEdit) {

            const item = await OrderDetail.findOne({
                where: {
                    idOrden: id,
                    id_menu_item: itemOrderUpdate.id_menu_item
                }
            });

            await item?.update({...itemOrderUpdate, done: false })

        };

        const orderUpdated = await Order.findOne({
            where: {
                idOrden: id,
            },
            attributes: OrderAttributes,
            include: [{
                model: OrderDetail, attributes: OrderDetialAttributes, include: [{
                    model: MenuItem, attributes: menuItemAttributes
                }]
            }, {
                model: Employee,
                attributes: employeeAttributes
            }, {
                model: Table,
                attributes: tableAttributes
            }]
        });

        return res.json({
            ok: true,
            order: orderUpdated
            
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false
        });
    }

}

const deleteOrder = async (req: Request, res: Response): Promise<Response> => {

    try {

        return res.json({
            ok: true
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false
        });
    }

}

// SOCKETS CONTROLLER

const sendOrder = (io: Server, room: string, payload: Order, action: string) => {
    io.to(room).emit(`/sockets/orders/${action}`, payload);
}

export {
    getOrdersUndone,
    getOrdersWithoutPaying,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    sendOrder,
}