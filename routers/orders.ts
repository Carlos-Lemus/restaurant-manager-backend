import { Router } from "express";
import { check } from "express-validator";

import {
    getOrdersUndone,
    getOrdersWithoutPaying,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
} from '../controllers/orders';
import { hasExistOrder, hasExistMenuItem, hasExistComercial } from '../helpers/db-validators';
import { validFields } from "../middlewares";

const router: Router = Router();

router.get('/undone/:idComercial', [
    check('idComercial').custom(hasExistComercial),
    validFields
], getOrdersUndone)

router.get('/without-paying/:idComercial', [
    check('idComercial').custom(hasExistComercial),
    validFields
], getOrdersWithoutPaying)

router.get('/:id', [
    check('id').custom(hasExistOrder),
    validFields
], getOrder);

router.post('/', [
    
    check('nombreCliente')
        .not().isEmpty()
        .withMessage('El nombre del cliente es obligatorio')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 2 caracteres'),
    check('fechaOrden')
        .not().isEmpty()
        .withMessage('La fecha de la orden es obligatorio'),
        // .isDate()
        // .withMessage('fechaOrden debe ser una fecha'),
    check('idEmpleado')
        .not().isEmpty()
        .withMessage('EL id del empleado es obligatorio')
        .isInt()
        .withMessage('El id del empleado debe ser un numero entero'),
    check('idComercial')
        .not().isEmpty()
        .withMessage('EL id del comercial es obligatorio')
        .isInt()
        .withMessage('El id del comercial debe ser un numero entero'),
    check('order_details')
        .not().isEmpty()
        .withMessage('Los order_details son obligatorios')
        .isArray({ min: 1 })
        .withMessage('order_details debe tener al menos un elemento'),
    check('order_details.*.id_menu_item')
        .not().isEmpty()
        .withMessage('El id_menu_item es obligatorio')
        .isInt()
        .withMessage('El id_menu_item debe ser un entero')
        .custom(hasExistMenuItem),
    check('order_details.*.cantidad')
        .not().isEmpty()
        .withMessage('La cantidad es obligatorio')
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un entero mayor a cero'),
    check('order_details.*.importe')
        .not().isEmpty()
        .withMessage('El importe es obligatorio')
        .isFloat()
        .withMessage('El importe debe ser un numero flotante'),
    check('order_details.*.comentario')
        .exists()
        .withMessage('El comentario es obligatorio')
        .isString()
        .withMessage('El comentario debe ser una cadena de caracteres'),
    validFields
], createOrder);

router.put('/:id', [
    check('id').custom(hasExistOrder),
    check('nombreCliente')
        .not().isEmpty()
        .withMessage('El nombre del cliente es obligatorio')
        .isLength({ min: 2 })
        .withMessage('El nombre debe tener al menos 3 caracteres'),
    check('fechaOrden')
        .not().isEmpty()
        .withMessage('La fecha de la cuenta es obligatorio'),
        // .isDate()
        // .withMessage('fechaOrden debe ser una fecha'),
    check('idEmpleado')
        .not().isEmpty()
        .withMessage('EL id del empleado es  obligatorio')
        .isInt()
        .withMessage('El id del empleado debe ser un numero entero'),
    check('idComercial')
        .not().isEmpty()
        .withMessage('EL id del comercial es obligatorio')
        .isInt()
        .withMessage('El id del comercial debe ser un numero entero'),
    validFields
], updateOrder);

router.delete('/:id', [
    check('id').custom(hasExistOrder),
    validFields
], deleteOrder);

export default router;