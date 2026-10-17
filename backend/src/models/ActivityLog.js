import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    user: { type: String, default: 'Tizim' },
    time: { type: String, default: 'Hozir' },
    type: { type: String, default: 'general' },
    icon: { type: String, default: 'Activity' },
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

const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
