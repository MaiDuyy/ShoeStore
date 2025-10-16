// models/Product.js
import mongoose from 'mongoose';
// import slugify from 'slugify';

const AttributesSchema = new mongoose.Schema(
  {
    sizes: { type: [String], default: [] },       // ví dụ: ["A5", "A6"]
    features: { type: [String], default: [] },    // ví dụ: ["72 sheets of premium lined paper"]
    colors: { type: [String], default: [] },      // ví dụ: ["brown", "red"]
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Tránh dùng 'id' vì dễ nhầm với _id của Mongo. Đổi thành 'sku' nếu cần mã riêng.
    sku: { type: String, unique: true, sparse: true, index: true },

    name: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },

    // Tuỳ bạn có muốn enum hay không. Để string tự do cho linh hoạt:
    gender: { type: String, required: true, index: true }, // ví dụ: "unisex", "men", "women"

    category: { type: String, required: true, index: true }, // ví dụ: "notebook"
    price: { type: Number, required: true, min: 0 },

    is_in_inventory: { type: Boolean, required: true, default: true },
    items_left: { type: Number, required: true, min: 0, default: 0 },

    imageURL: { type: String, required: true },

    slug: { type: String, required: true, unique: true, index: true },

    featured: { type: Number, required: true, default: 0 }, // ví dụ: điểm nổi bật 0-10

    attributes: { type: AttributesSchema, default: {} },
  },
  { timestamps: true }
);

// // Tự sinh slug từ name nếu chưa có
// productSchema.pre('validate', function (next) {
//   if (!this.slug && this.name) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }
//   next();
// });

export default mongoose.model('Product', productSchema);
