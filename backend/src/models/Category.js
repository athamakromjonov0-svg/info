import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    legacyId: { type: String, index: true },
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
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

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
