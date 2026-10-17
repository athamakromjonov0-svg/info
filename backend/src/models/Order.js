import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    id: { type: String },
    name: { type: String, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    customer: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    couponDiscount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Qabul qilindi', 'Tayyorlanmoqda', "Yo'lda", 'Yetkazildi', 'Bekor qilindi'],
      default: 'Qabul qilindi',
      index: true,
    },
    paymentMethod: { type: String, default: 'cash' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    address: { type: mongoose.Schema.Types.Mixed, default: null },
    deliveryZone: { type: mongoose.Schema.Types.Mixed, default: null },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.orderNumber || ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
