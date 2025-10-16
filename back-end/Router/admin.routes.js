import express from 'express';
import authJwt from '../middlewares/authJwt.js';
import * as adminController from '../controllers/admin.controller.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authJwt.verifyToken);
router.use(authJwt.isAdmin);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/roles', adminController.getAllRoles);

// Product Management
router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Order Management
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);

export default router;
