import express from 'express';
import authJwt from '../middlewares/authJwt.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.use(authJwt.verifyToken);

// User routes
router.post('/create', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authJwt.isAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', authJwt.isAdmin, orderController.updateOrderStatus);

export default router;
