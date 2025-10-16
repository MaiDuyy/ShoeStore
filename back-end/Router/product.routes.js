import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await Product.find()
    const mapped = list.map(doc => {
      const obj = doc.toObject()
      obj.id = obj._id // Thêm trường id từ _id
      delete obj._id // Xóa trường _id nếu không cần thiết
      delete obj.__v // Xóa trường __v nếu không cần thiết
      return obj
    })
    res.json(mapped)
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" })
  }
});
router.get('/group-by-category', async (req, res) => {
  try {
    const grouped = await Product.aggregate([
      { $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$items_left' },
          products: { $push: '$$ROOT' },
        }
      },
      { $sort: { _id: 1 } },
      { $project: {
          _id: 0,
          category: '$_id',
          totalProducts: 1,
          averagePrice: 1,
          totalStock: 1,
          products: 1
        }
      }
    ]);
    res.json(grouped);
  } catch (error) {
    console.error('Error grouping products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.id })
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" })
    }
    const obj = product.toObject()
    obj.id = obj._id // Thêm trường id từ _id
    delete obj._id // Xóa trường _id nếu không cần thiết
    delete obj.__v // Xóa trường __v nếu không cần thiết
    res.json(obj)
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm" })
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" })
    }
    const obj = product.toObject()
    obj.id = obj._id // Thêm trường id từ _id
    delete obj._id // Xóa trường _id nếu không cần thiết
    delete obj.__v // Xóa trường __v nếu không cần thiết
    res.json(obj)
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm" })
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const list = await Product.find({ category: req.params.category })
    const mapped = list.map(doc => {
      const obj = doc.toObject()
      obj.id = obj._id // Thêm trường id từ _id
      delete obj._id // Xóa trường _id nếu không cần thiết
      delete obj.__v // Xóa trường __v nếu không cần thiết
      return obj
    }

    )
    res.json(mapped)
  }
  catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" })
  } 
});
router.get('/top/:category', async (req, res) => {
  try {
    const { category } = req.params;

    // Tìm sản phẩm theo loại, sắp xếp theo "featured" giảm dần (hoặc price nếu muốn)
    const topProducts = await Product.find({ category })
      .sort({ featured: -1, price: -1 }) // ưu tiên sản phẩm nổi bật nhất
      .limit(5)
      .lean();

    // Nếu không có dữ liệu
    if (!topProducts || topProducts.length === 0) {
      return res.status(404).json({ message: `Không tìm thấy sản phẩm thuộc loại ${category}` });
    }

    // Chuẩn hóa dữ liệu: thêm id, bỏ _id và __v
    const mapped = topProducts.map(({ _id, __v, ...rest }) => ({ id: _id, ...rest }));

    res.json({
      category,
      total: mapped.length,
      products: mapped
    });
  } catch (error) {
    console.error('Error fetching top products by category:', error);
    res.status(500).json({ message: 'Lỗi khi lấy top sản phẩm', error: error.message });
  }
});
export { router as productRouter };