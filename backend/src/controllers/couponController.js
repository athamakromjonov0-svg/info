import Coupon from '../models/Coupon.js';
import ActivityLog from '../models/ActivityLog.js';
import { isDbConnected } from '../config/db.js';
import { getDb, saveDb, addFallbackActivity } from '../utils/fallbackStore.js';

const findFallbackCoupon = (idOrCode) => {
  const coupons = getDb().coupons || [];
  const key = String(idOrCode);
  return coupons.find(c => String(c.id) === key || c.code === key.toUpperCase().trim());
};

// @desc    Barcha kuponlarni olish
// @route   GET /api/coupons
export const getCoupons = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(getDb().coupons || []);
    }
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Kuponni tekshirish (Apply coupon)
// @route   POST /api/coupons/validate
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Kupon kodini kiriting" });
    }

    if (!isDbConnected()) {
      const coupon = (getDb().coupons || []).find(c => c.code === code.toUpperCase().trim() && c.active !== false);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Bunday kupon mavjud emas" });
      }
      if (coupon.minSpend && Number(subtotal) < coupon.minSpend) {
        return res.status(400).json({
          success: false,
          message: `Ushbu kupon kamida ${coupon.minSpend.toLocaleString()} so'mlik xaridlarga amal qiladi`,
        });
      }
      return res.json({
        success: true,
        message: `Kupon qabul qilindi: ${coupon.discount}% chegirma!`,
        data: coupon,
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Bunday kupon mavjud emas yoki muddati o'tgan" });
    }

    if (coupon.minSpend && Number(subtotal) < coupon.minSpend) {
      return res.status(400).json({
        success: false,
        message: `Ushbu kupon kamida ${coupon.minSpend.toLocaleString()} so'mlik xaridlarga amal qiladi`,
      });
    }

    res.json({
      success: true,
      message: `Kupon qabul qilindi: ${coupon.discount}% chegirma!`,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Yangi kupon yaratish (Admin)
// @route   POST /api/coupons
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, minSpend, active, expiresAt } = req.body;
    if (!code || discount === undefined) {
      return res.status(400).json({ success: false, message: "Kupon kodi va chegirma foizini kiriting" });
    }

    const finalCode = code.toUpperCase().trim();

    if (!isDbConnected()) {
      const dbData = getDb();
      dbData.coupons = dbData.coupons || [];
      if (dbData.coupons.some(c => c.code === finalCode)) {
        return res.status(400).json({ success: false, message: "Ushbu kodli kupon allaqachon mavjud" });
      }
      const coupon = {
        id: `CPN-${Date.now()}`,
        code: finalCode,
        discount: Number(discount),
        minSpend: Number(minSpend) || 0,
        active: active !== undefined ? Boolean(active) : true,
        expiresAt: expiresAt || null,
        createdAt: new Date().toISOString(),
      };
      dbData.coupons.unshift(coupon);
      saveDb();
      addFallbackActivity(`Kupon ${coupon.code} yaratildi (${coupon.discount}%)`, req.user ? req.user.name : 'Admin', 'coupon', 'Percent');
      return res.status(201).json(coupon);
    }

    const existing = await Coupon.findOne({ code: finalCode });
    if (existing) {
      return res.status(400).json({ success: false, message: "Ushbu kodli kupon allaqachon mavjud" });
    }

    const coupon = await Coupon.create({
      code: finalCode,
      discount: Number(discount),
      minSpend: Number(minSpend) || 0,
      active: active !== undefined ? Boolean(active) : true,
      expiresAt: expiresAt || null,
    });

    await ActivityLog.create({
      action: `Kupon ${coupon.code} yaratildi (${coupon.discount}%)`,
      user: req.user ? req.user.name : 'Admin',
      type: 'coupon',
      icon: 'Percent',
      time: 'Hozir',
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Kuponni yangilash (Admin)
// @route   PUT /api/coupons/:id
export const updateCoupon = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const coupon = findFallbackCoupon(req.params.id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Kupon topilmadi" });
      }
      Object.assign(coupon, req.body);
      if (req.body.code) coupon.code = req.body.code.toUpperCase().trim();
      saveDb();
      return res.json(coupon);
    }

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Kupon topilmadi" });
    }

    Object.assign(coupon, req.body);
    if (req.body.code) coupon.code = req.body.code.toUpperCase().trim();
    const updated = await coupon.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Kuponni o'chirish (Admin)
// @route   DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const coupons = getDb().coupons || [];
      const index = coupons.findIndex(c => String(c.id) === String(req.params.id) || c.code === String(req.params.id).toUpperCase().trim());
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Kupon topilmadi" });
      }
      coupons.splice(index, 1);
      saveDb();
      addFallbackActivity(`Kupon o'chirildi: ${req.params.id}`, req.user ? req.user.name : 'Admin', 'coupon', 'Percent');
      return res.json({ success: true, message: "Kupon o'chirildi" });
    }

    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Kupon topilmadi" });
    }
    res.json({ success: true, message: "Kupon o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};