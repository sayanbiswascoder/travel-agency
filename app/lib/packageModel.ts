import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    badge: String,
    price: Number,
    duration: String,
    rating: Number,
    image: String,
    summary: String,
    description: String,
    features: [String],
    itinerary: [{ day: String, title: String, description: String }],
  },
  { timestamps: true }
);

const PackageModel = (mongoose.models.Package as mongoose.Model<any>) || mongoose.model('Package', PackageSchema);
export default PackageModel;
