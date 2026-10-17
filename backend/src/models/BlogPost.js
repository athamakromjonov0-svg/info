import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: 'Yangiliklar' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    readTime: { type: Number, default: 5 },
    image: { type: String, default: '/banner/banner1.png' },
    author: { type: String, default: 'Grand Decor Studio' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    content: [{ type: String }],
    tags: [{ type: String }],
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

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
