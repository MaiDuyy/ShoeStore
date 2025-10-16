import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

// Create order from cart
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, note, selectedItems } = req.body;
    
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Filter items based on selection
    let itemsToOrder = cart.items;
    if (selectedItems && Array.isArray(selectedItems) && selectedItems.length > 0) {
      itemsToOrder = cart.items.filter(item => {
        const itemKey = `${item.product._id}-${item.size}-${item.color}`;
        return selectedItems.includes(itemKey);
      });
    }
    
    if (itemsToOrder.length === 0) {
      return res.status(400).json({ message: 'No items selected for checkout' });
    }
    
    // Validate stock
    for (const item of itemsToOrder) {
      if (!item.product.is_in_inventory || item.product.items_left < item.quantity) {
        return res.status(400).json({ 
          message: `Product ${item.product.name} is out of stock` 
        });
      }
    }
    
    // Calculate amounts for selected items only
    const subtotal = itemsToOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k
    const totalAmount = subtotal + shippingFee;
    
    // Create order items
    const orderItems = itemsToOrder.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.price,
      imageURL: item.product.imageURL
    }));
    
    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      subtotal,
      shippingFee,
      totalAmount,
      note
    });
    
    await order.save();
    
    // Update product stock
    for (const item of itemsToOrder) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { items_left: -item.quantity }
      });
    }
    
    // Remove ordered items from cart
    cart.items = cart.items.filter(item => {
      const itemKey = `${item.product._id}-${item.size}-${item.color}`;
      return !selectedItems || !selectedItems.includes(itemKey);
    });
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (order.status !== 'PENDING') {
      return res.status(400).json({ 
        message: 'Cannot cancel order that is already processed' 
      });
    }
    
    order.status = 'CANCELLED';
    await order.save();
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { items_left: item.quantity }
      });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Order.countDocuments(query);
    
    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    
    if (status === 'DELIVERED') {
      order.deliveredAt = new Date();
    }
    
    await order.save();
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
