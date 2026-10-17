import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    legacyId: { type: String, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    images: [{ type: String }],
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, default: 0, min: 0 },
    isNew: { type: Boolean, default: false },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    specs: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.legacyId || ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Qidiruv uchun index
productSchema.index({ title: 'text', description: 'text', category: 'text' });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
