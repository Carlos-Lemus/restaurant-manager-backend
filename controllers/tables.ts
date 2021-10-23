import { Request, Response } from "express";
import { Table } from "../models";


const getTablesByComercial = async (req: Request, res: Response): Promise<Response> => {

    const { idComercial } = req.params;

    try {

        const tables = await Table.findAll({
            where: {
                idComercial
            }
        })

        return res.json({
            ok: true,
            collection: {
                hasItems: tables.length > 0 ? true : false,
                items: tables,
                total: tables.length
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        });
    }

}

const getTablesAvailable = async (req: Request, res: Response): Promise<Response> => {

    const { idComercial } = req.params;

    try {

        const tables = await Table.findAll({
            where: {
                idComercial,
                disponible: true
            }
        })

        return res.json({
            ok: true,
            collection: {
                hasItems: tables.length > 0 ? true : false,
                items: tables,
                total: tables.length
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        });
    }

}

const getTable = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;

    try {

        const table = await Table.findByPk(id);

        return res.json({
            ok: true,
            table
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        });
    }

}
const createTable = async (req: Request, res: Response): Promise<Response> => {

    const payload = req.body;

    try {

        const table = await Table.create(payload);

        return res.json({
            ok: true,
            table
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        });
    }

}

const updateTable = async (req: Request, res: Response): Promise<Response> => {

    const { id } = req.params;
    const payload = req.body;

    try {

        const table = await Table.findByPk(id);

        await table?.update(payload);

        return res.json({
            ok: true,
            table
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        });
    }

}

const deleteTable = async (req: Request, res: Response): Promise<Response> => {

    try {

        return res.json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false
        });
    }

}

export {
    getTablesByComercial,
    getTablesAvailable,
    getTable,
    createTable,
    updateTable,
    deleteTable,
}