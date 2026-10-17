import mongoose from 'mongoose';

const deliveryZoneSchema = new mongoose.Schema(
  {
    legacyId: { type: String, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    days: { type: String, default: '1-3 kun' },
    freeFrom: { type: Number, default: 1000000 },
    active: { type: Boolean, default: true },
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

const DeliveryZone = mongoose.models.DeliveryZone || mongoose.model('DeliveryZone', deliveryZoneSchema);
export default DeliveryZone;
