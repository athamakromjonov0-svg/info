import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    avatar: { type: String, default: '' },
    bonusPoints: { type: Number, default: 0 },
    addresses: [
      {
        id: { type: String },
        title: { type: String, default: 'Uy' },
        city: { type: String, default: 'Toshkent' },
        street: { type: String, default: '' },
        house: { type: String, default: '' },
        apartment: { type: String, default: '' },
        phone: { type: String, default: '' },
        isDefault: { type: Boolean, default: false },
      },
    ],
    savedCards: [
      {
        id: { type: String },
        cardNumber: { type: String },
        expiry: { type: String },
        cardHolder: { type: String },
        type: { type: String, default: 'Uzcard' },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Parolni saqlashdan oldin xesh qilish
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Parolni tekshirish metodi
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
