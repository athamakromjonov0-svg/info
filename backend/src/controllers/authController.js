import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { isDbConnected } from '../config/db.js';
import { getDb, saveDb, addFallbackActivity } from '../utils/fallbackStore.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_2026_premium_ecommerce_platform', {
    expiresIn: '30d',
  });
};

const sanitizeUser = (user) => {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
};

const findFallbackUser = (id) => {
  const users = getDb().users || [];
  const key = String(id);
  return users.find(u => String(u.id) === key || String(u._id) === key);
};

// @desc    Ro'yxatdan o'tish (Register)
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring" });
    }

    if (!isDbConnected()) {
      const cleanEmail = email.toLowerCase().trim();
      const dbData = getDb();
      dbData.users = dbData.users || [];
      const existing = dbData.users.find(u => u.email === cleanEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: "Ushbu email allaqachon ro'yxatdan o'tgan" });
      }
      const newUser = {
        id: `USR-${Date.now()}`,
        name,
        email: cleanEmail,
        password,
        role: cleanEmail === (process.env.ADMIN_EMAIL || 'admin@premium.com') ? 'admin' : 'user',
        status: 'active',
        bonusPoints: 0,
        phone: phone || '',
        addresses: [],
        savedCards: [],
        joined: new Date().toISOString(),
      };
      dbData.users.push(newUser);
      saveDb();
      addFallbackActivity(`Yangi foydalanuvchi ro'yxatdan o'tdi: ${newUser.name}`, newUser.name, 'user', 'UserPlus');
      return res.status(201).json({
        success: true,
        message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
        data: {
          ...sanitizeUser(newUser),
          token: generateToken(newUser.id),
        },
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: "Ushbu email allaqachon ro'yxatdan o'tgan" });
    }

    // Birinchi foydalanuvchi yoki admin email avtomatik admin bo'ladi
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@premium.com').toLowerCase();
    const isFirstUser = (await User.countDocuments()) === 0;
    const role = (email.toLowerCase().trim() === adminEmail || isFirstUser) ? 'admin' : 'user';

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role,
    });

    await ActivityLog.create({
      action: `Yangi foydalanuvchi ro'yxatdan o'tdi: ${user.name}`,
      user: user.name,
      type: 'user',
      icon: 'UserPlus',
      time: 'Hozir',
    });

    res.status(201).json({
      success: true,
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        bonusPoints: user.bonusPoints,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Tizimga kirish (Login)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email va parolni kiriting" });
    }

    if (!isDbConnected()) {
      const cleanEmail = email.toLowerCase().trim();
      const user = (getDb().users || []).find(u => u.email === cleanEmail);
      if (!user || (user.password && user.password !== password)) {
        return res.status(401).json({ success: false, message: "Email yoki parol noto'g'ri" });
      }
      return res.json({
        success: true,
        message: "Tizimga muvaffaqiyatli kirdingiz",
        data: {
          ...sanitizeUser(user),
          token: generateToken(user.id),
        },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: "Hisobingiz ma'muriyat tomonidan bloklangan" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Email yoki parol noto'g'ri" });
    }

    res.json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        bonusPoints: user.bonusPoints,
        addresses: user.addresses,
        savedCards: user.savedCards,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Joriy foydalanuvchi ma'lumotlari
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = findFallbackUser(req.user ? req.user.id : '');
      if (!user) {
        return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }
      return res.json({ success: true, data: sanitizeUser(user) });
    }
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Profilni yangilash
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = findFallbackUser(req.user ? req.user.id : '');
      if (!user) {
        return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.avatar = req.body.avatar || user.avatar;
      if (req.body.addresses) user.addresses = req.body.addresses;
      if (req.body.savedCards) user.savedCards = req.body.savedCards;
      if (req.body.password) user.password = req.body.password;
      saveDb();
      return res.json({
        success: true,
        message: "Profil muvaffaqiyatli yangilandi",
        data: {
          ...sanitizeUser(user),
          token: generateToken(user.id),
        },
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar || user.avatar;
    if (req.body.addresses) user.addresses = req.body.addresses;
    if (req.body.savedCards) user.savedCards = req.body.savedCards;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      message: "Profil muvaffaqiyatli yangilandi",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        bonusPoints: updatedUser.bonusPoints,
        addresses: updatedUser.addresses,
        savedCards: updatedUser.savedCards,
        token: generateToken(updatedUser._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Barcha foydalanuvchilar (Admin uchun)
// @route   GET /api/auth/users
export const getAllUsers = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const users = (getDb().users || []).map(sanitizeUser);
      return res.json({ success: true, count: users.length, data: users });
    }
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Yangi foydalanuvchi yaratish (Admin)
// @route   POST /api/auth/users
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user', status = 'active', phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Ism va email kiritilishi shart" });
    }
    const cleanEmail = email.toLowerCase().trim();

    if (!isDbConnected()) {
      const dbData = getDb();
      dbData.users = dbData.users || [];
      if (dbData.users.some(u => u.email === cleanEmail)) {
        return res.status(400).json({ success: false, message: "Ushbu email allaqachon ro'yxatdan o'tgan" });
      }
      const newUser = {
        id: `USR-${Date.now()}`,
        name,
        email: cleanEmail,
        password: password || 'user123',
        role,
        status,
        bonusPoints: 0,
        phone: phone || '',
        addresses: [],
        savedCards: [],
        joined: new Date().toISOString(),
      };
      dbData.users.push(newUser);
      saveDb();
      addFallbackActivity(`Yangi foydalanuvchi qo'shildi: ${newUser.name}`, req.user ? req.user.name : 'Admin', 'user', 'UserPlus');
      return res.status(201).json({ success: true, data: sanitizeUser(newUser) });
    }

    const user = await User.create({ name, email: cleanEmail, password: password || 'user123', role, status, phone: phone || '' });
    return res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Foydalanuvchini yangilash (Admin)
// @route   PUT /api/auth/users/:id
export const updateUser = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = findFallbackUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }
      Object.assign(user, req.body);
      if (req.body.email) user.email = req.body.email.toLowerCase().trim();
      saveDb();
      addFallbackActivity(`Foydalanuvchi yangilandi (${user.email})`, req.user ? req.user.name : 'Admin', 'user', 'Edit');
      return res.json({ success: true, message: "Foydalanuvchi yangilandi", data: sanitizeUser(user) });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }
    Object.assign(user, req.body);
    const updated = await user.save();
    return res.json({ success: true, message: "Foydalanuvchi yangilandi", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Foydalanuvchi statusini o'zgartirish (Bloklash/Faollashtirish)
// @route   PATCH /api/auth/users/:id/status
export const toggleUserStatus = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = findFallbackUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }
      user.status = user.status === 'active' ? 'blocked' : 'active';
      saveDb();
      addFallbackActivity(`Foydalanuvchi statusi o'zgartirildi (${user.email} -> ${user.status})`, req.user ? req.user.name : 'Admin', 'user', user.status === 'blocked' ? 'Ban' : 'CheckCircle');
      return res.json({ success: true, message: `Foydalanuvchi statusi: ${user.status}`, data: sanitizeUser(user) });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    await ActivityLog.create({
      action: `Foydalanuvchi statusi o'zgartirildi (${user.email} -> ${user.status})`,
      user: req.user.name,
      type: 'user',
      icon: user.status === 'blocked' ? 'Ban' : 'CheckCircle',
      time: 'Hozir',
    });

    res.json({ success: true, message: `Foydalanuvchi statusi: ${user.status}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Foydalanuvchi rolini o'zgartirish
// @route   PATCH /api/auth/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ success: false, message: "Noto'g'ri rol kiritildi" });
    }

    if (!isDbConnected()) {
      const user = findFallbackUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }
      user.role = role;
      saveDb();
      return res.json({ success: true, message: "Rol yangilandi", data: sanitizeUser(user) });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }

    res.json({ success: true, message: "Rol yangilandi", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Foydalanuvchini o'chirish
// @route   DELETE /api/auth/users/:id
export const deleteUser = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const users = getDb().users || [];
      const index = users.findIndex(u => String(u.id) === String(req.params.id) || String(u._id) === String(req.params.id));
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
      }
      users.splice(index, 1);
      saveDb();
      addFallbackActivity("Foydalanuvchi o'chirildi", req.user ? req.user.name : 'Admin', 'user', 'Trash2');
      return res.json({ success: true, message: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Foydalanuvchi topilmadi" });
    }
    res.json({ success: true, message: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};