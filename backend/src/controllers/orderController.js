import Order from '../models/Order.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import Product from '../models/Product.js';
import { isDbConnected } from '../config/db.js';
import { getDb, saveDb, addFallbackActivity } from '../utils/fallbackStore.js';

const findFallbackOrder = (id) => {
  const orders = getDb().orders || [];
  return orders.find(o => String(o.id) === String(id) || String(o.orderNumber) === String(id));
};

// @desc    Yangi buyurtma yaratish
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, orderInfo = {}, subtotal, couponDiscount = 0, deliveryFee = 0, total, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Savatda mahsulot mavjud emas" });
    }

    const calculatedSubtotal = Number(subtotal) || items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const discount = Number(item.discount) || 0;
      const itemPrice = discount > 0 ? price * (1 - discount / 100) : price;
      return sum + itemPrice * (item.quantity || 1);
    }, 0);

    const calcTotal = Number(total) || (calculatedSubtotal - Number(couponDiscount) + Number(deliveryFee));

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)}`;

    if (!isDbConnected()) {
      const newOrder = {
        id: orderNumber,
        orderNumber,
        items: items.map(item => ({
          id: item.id || item._id,
          name: item.name || item.title || 'Mahsulot',
          image: item.image,
          quantity: item.quantity || 1,
          price: Number(item.price) || 0,
          discount: Number(item.discount) || 0,
        })),
        subtotal: calculatedSubtotal,
        couponDiscount: Number(couponDiscount) || 0,
        deliveryFee: Number(deliveryFee) || 0,
        total: calcTotal,
        status: 'Qabul qilindi',
        paymentMethod: orderInfo.paymentMethod || 'cash',
        address: orderInfo.address || null,
        deliveryZone: orderInfo.deliveryZone || null,
        notes: orderInfo.notes || '',
        customer: customer || null,
        createdAt: new Date().toISOString(),
      };
      const dbData = getDb();
      dbData.orders = dbData.orders || [];
      dbData.orders.unshift(newOrder);

      // Mahsulotlar qoldig'ini (stock) kamaytirish — lokal xotirada
      dbData.products = dbData.products || [];
      for (const item of items) {
        const prodId = item.productId || item.id || item._id;
        const prod = dbData.products.find(p =>
          String(p.id) === String(prodId) || String(p.legacyId) === String(prodId) || String(p._id) === String(prodId)
        );
        if (prod) prod.stock = Math.max(0, (Number(prod.stock) || 0) - (item.quantity || 1));
      }
      saveDb();
      addFallbackActivity(`Yangi buyurtma qabul qilindi: #${orderNumber}`, customer?.name || 'Mijoz', 'order', 'ShoppingBag');
      return res.status(201).json(newOrder);
    }

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : null,
      customer: customer || (req.user ? { name: req.user.name, email: req.user.email, phone: req.user.phone } : {}),
      items: items.map(item => ({
        id: item.id || item._id,
        name: item.name || item.title || 'Mahsulot',
        image: item.image,
        quantity: item.quantity || 1,
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
      })),
      subtotal: calculatedSubtotal,
      couponDiscount: Number(couponDiscount) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      total: calcTotal,
      status: 'Qabul qilindi',
      paymentMethod: orderInfo.paymentMethod || 'cash',
      address: orderInfo.address || null,
      deliveryZone: orderInfo.deliveryZone || null,
      notes: orderInfo.notes || '',
    });

    // Mahsulotlar qoldig'ini (stock) kamaytirish
    for (const item of items) {
      try {
        const prodId = item.productId || item.id || item._id;
        if (prodId) {
          await Product.findOneAndUpdate(
            { $or: [{ _id: prodId }, { legacyId: String(prodId) }] },
            { $inc: { stock: -(item.quantity || 1) } }
          );
        }
      } catch (err) {
        console.warn("Stock kamaytirishda ogohlantirish:", err.message);
      }
    }

    // Foydalanuvchiga bonus ball berish (har 10,000 so'm uchun 1 ball)
    const pointsEarned = Math.floor(calculatedSubtotal / 10000);
    if (req.user && pointsEarned > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { bonusPoints: pointsEarned } });
    }

    await ActivityLog.create({
      action: `Yangi buyurtma qabul qilindi: #${order.orderNumber}`,
      user: customer?.name || (req.user ? req.user.name : 'Mijoz'),
      type: 'order',
      icon: 'ShoppingBag',
      time: 'Hozir',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Foydalanuvchining shaxsiy buyurtmalari
// @route   GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(getDb().orders || []);
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Barcha buyurtmalarni olish (Admin)
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const { status } = req.query;
      let list = [...(getDb().orders || [])];
      if (status && status !== 'all') {
        list = list.filter(o => o.status === status);
      }
      return res.json(list);
    }

    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    if (req.query.format === 'object') {
      return res.json({ success: true, count: orders.length, data: orders });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Buyurtma statusini o'zgartirish (Admin)
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!isDbConnected()) {
      const order = findFallbackOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Buyurtma topilmadi" });
      }
      order.status = status;
      saveDb();
      addFallbackActivity(`Buyurtma #${order.orderNumber} statusi yangilandi: ${status}`, req.user ? req.user.name : 'Admin', 'order', 'RefreshCcw');
      return res.json(order);
    }

    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderNumber: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Buyurtma topilmadi" });
    }

    order.status = status;
    await order.save();

    await ActivityLog.create({
      action: `Buyurtma #${order.orderNumber} statusi yangilandi: ${status}`,
      user: req.user ? req.user.name : 'Admin',
      type: 'order',
      icon: 'RefreshCcw',
      time: 'Hozir',
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Buyurtmani o'chirish (Admin)
// @route   DELETE /api/orders/:id
export const deleteOrder = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const orders = getDb().orders || [];
      const index = orders.findIndex(o => String(o.id) === String(req.params.id) || String(o.orderNumber) === String(req.params.id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Buyurtma topilmadi" });
      }
      orders.splice(index, 1);
      saveDb();
      return res.json({ success: true, message: "Buyurtma o'chirildi", id: req.params.id });
    }

    const order = await Order.findOneAndDelete({
      $or: [{ _id: req.params.id }, { orderNumber: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Buyurtma topilmadi" });
    }

    res.json({ success: true, message: "Buyurtma o'chirildi", id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};