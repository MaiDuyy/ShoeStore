import sql from 'mssql'
import express from 'express'
import cors from 'cors'
import config from './utils/db.js'
import { adminRouter } from './Router/adminrouter.js'
import { userRouter } from './Router/customerrouter.js'
import { productRouter } from './Router/productRouter.js'

const app = express() 
const PORT = 5000;

app.use(cors({
  origin : ['http://localhost:5173'],
  methods : ['GET', 'PUT', 'POST'],
  credentials : true
}));


app.use(express.json());
app.use('/auth',adminRouter);
app.use('/auth',userRouter)
app.use('/ap',productRouter)





// app.get('/api/shoes', async (req, res) => {
//   try {
//     await sql.connect(config);
//     const result = await sql.query`SELECT * FROM Shoes`;
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error fetching shoes:', err);
//     res.status(500).send('Server error');
//   } finally {
//     sql.close();
//   }
// });

app.get('/api/shoes', async (req, res) => {
  try {
      await sql.connect(config);

      // Lấy thông tin cơ bản của tất cả sản phẩm
      const products = await sql.query`
          SELECT s.*, c.category_name, b.brand_name 
          FROM Shoes s
          JOIN Categories c ON s.category_id = c.category_id
          JOIN Brand b ON c.brand_id = b.brand_id
      `;

      if (products.recordset.length === 0) {
          return res.status(404).send('No products found');
      }

      // Lấy thông tin chi tiết cho từng sản phẩm
      const productDetails = await Promise.all(
          products.recordset.map(async (product) => {
              const productId = product.shoes_id;

              // Lấy các hình ảnh
              const images = await sql.query`
                  SELECT image_url 
                  FROM Images 
                  WHERE shoes_id = ${productId}
              `;

              // Lấy các màu sắc có sẵn
              const colors = await sql.query`
                  SELECT DISTINCT c.color_id, c.color_name 
                  FROM Quantity q
                  JOIN Color c ON q.color_id = c.color_id
                  WHERE q.shoes_id = ${productId} AND q.quantity > 0
              `;

              // Lấy các kích cỡ có sẵn
              const sizes = await sql.query`
                  SELECT DISTINCT s.size_id, s.size_name 
                  FROM Quantity q
                  JOIN Size s ON q.size_id = s.size_id
                  WHERE q.shoes_id = ${productId} AND q.quantity > 0
              `;

              // Lấy tồn kho chi tiết
              const quantities = await sql.query`
                  SELECT q.*, c.color_name, s.size_name 
                  FROM Quantity q
                  JOIN Color c ON q.color_id = c.color_id
                  JOIN Size s ON q.size_id = s.size_id
                  WHERE q.shoes_id = ${productId}
              `;

              return {
                  ...product,
                  images: images.recordset.map(i => i.image_url),
                  availableColors: colors.recordset,
                  availableSizes: sizes.recordset,
                  quantities: quantities.recordset,
                  brand: product.brand_name,
                  category: product.category_name
              };
          })
      );

      res.json(productDetails);
      
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  } finally {
      sql.close();
  }
});

app.get('/api/admin', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Admin`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching shoes:', err);
    res.status(500).send('Server error');
  } finally {
    sql.close();
  }
});


app.get('/api/shoes/:shoes_id', async (req, res) => {
  // const shoeId = parseInt(req.params.shoes_id, 10); // Chuyển sang số nguyên
  // if (isNaN(shoeId)) {
  //   return res.status(400).send('Invalid shoe ID');
  // }
  const shoeId = req.params.shoes_id;
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Shoes WHERE shoes_id = ${shoeId}`;

    if (result.recordset.length === 0) {
      return res.status(404).send('Shoe not found');
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching shoe:', err);
    res.status(500).send('Server error');
  } finally {
    sql.close();
  }
});

app.get('/api/img', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Images`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching shoes:', err);
    res.status(500).send('Server error');
  } finally {
    sql.close();
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});