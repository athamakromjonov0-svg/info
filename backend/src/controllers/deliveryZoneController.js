import DeliveryZone from '../models/DeliveryZone.js';
import { isDbConnected } from '../config/db.js';
import { getDb, saveDb } from '../utils/fallbackStore.js';

// @desc    Yetkazib berish hududlarini olish
// @route   GET /api/delivery-zones
export const getDeliveryZones = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const zones = getDb().deliveryZones || [];
      return res.json([...zones].sort((a, b) => (a.price || 0) - (b.price || 0)));
    }
    const zones = await DeliveryZone.find().sort({ price: 1 });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Yangi hudud qo'shish (Admin)
// @route   POST /api/delivery-zones
export const createDeliveryZone = async (req, res) => {
  try {
    const { name, price, days, freeFrom } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: "Hudud nomi va narxini kiriting" });
    }

    if (!isDbConnected()) {
      const zone = {
        id: `zone-${Date.now()}`,
        name: name.trim(),
        price: Number(price),
        days: days || '1-3 kun',
        freeFrom: Number(freeFrom) || 1000000,
      };
      const dbData = getDb();
      dbData.deliveryZones = dbData.deliveryZones || [];
      dbData.deliveryZones.push(zone);
      saveDb();
      return res.status(201).json(zone);
    }

    const legacyId = `zone-${Date.now()}`;
    const zone = await DeliveryZone.create({
      legacyId,
      name: name.trim(),
      price: Number(price),
      days: days || '1-3 kun',
      freeFrom: Number(freeFrom) || 1000000,
    });

    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Hududni yangilash (Admin)
// @route   PUT /api/delivery-zones/:id
export const updateDeliveryZone = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const zones = getDb().deliveryZones || [];
      const index = zones.findIndex(z => String(z.id) === String(req.params.id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Hudud topilmadi" });
      }
      zones[index] = { ...zones[index], ...req.body };
      saveDb();
      return res.json(zones[index]);
    }

    const zone = await DeliveryZone.findOne({
      $or: [{ _id: req.params.id }, { legacyId: req.params.id }],
    });

    if (!zone) {
      return res.status(404).json({ success: false, message: "Hudud topilmadi" });
    }

    Object.assign(zone, req.body);
    const updated = await zone.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Hududni o'chirish (Admin)
// @route   DELETE /api/delivery-zones/:id
export const deleteDeliveryZone = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const zones = getDb().deliveryZones || [];
      const index = zones.findIndex(z => String(z.id) === String(req.params.id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Hudud topilmadi" });
      }
      zones.splice(index, 1);
      saveDb();
      return res.json({ success: true, message: "Hudud o'chirildi" });
    }

    const zone = await DeliveryZone.findOneAndDelete({
      $or: [{ _id: req.params.id }, { legacyId: req.params.id }],
    });

    if (!zone) {
      return res.status(404).json({ success: false, message: "Hudud topilmadi" });
    }

    res.json({ success: true, message: "Hudud o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};