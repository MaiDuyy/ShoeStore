import express from 'express';
import authJwt from '../middlewares/authJwt.js';
import * as cartController from '../controllers/cart.controller.js';

const router = express.Router();

router.use(authJwt.verifyToken);


router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

export default router;
