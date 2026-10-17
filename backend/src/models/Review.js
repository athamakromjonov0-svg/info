import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('uz-UZ') },
    likes: { type: Number, default: 0 },
    verified: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
