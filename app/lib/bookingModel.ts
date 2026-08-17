import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    packageSlug: { type: String, required: true },
    packageTitle: String,
    firstName: String,
    lastName: String,
    name: String,
    email: String,
    phone: String,
    guests: Number,
    startDate: String,
    endDate: String,
    notes: String,
    totalCost: Number,
    payment: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const BookingModel = (mongoose.models.Booking as mongoose.Model<any>) || mongoose.model('Booking', BookingSchema);
export default BookingModel;
