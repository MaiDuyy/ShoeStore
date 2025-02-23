import express from 'express';
import config from '../utils/db.js';
import sql from 'mssql';

const router = express.Router();

router.get('/shoes/:shoes_id', async (req, res) => {
    const shoeId = req.params.shoes_id;

    try {
        await sql.connect(config);

        // Lấy thông tin cơ bản của sản phẩm
        const product = await sql.query`
            SELECT s.*, c.category_name, b.brand_name 
            FROM Shoes s
            JOIN Categories c ON s.category_id = c.category_id
            JOIN Brand b ON c.brand_id = b.brand_id
            WHERE s.shoes_id = ${shoeId}
        `;

        if (product.recordset.length === 0) {
            return res.status(404).send('Shoe not found');
        }

        // Lấy các hình ảnh
        const images = await sql.query`
            SELECT image_url 
            FROM Images 
            WHERE shoes_id = ${shoeId}
        `;

        // Lấy các màu sắc có sẵn
        const colors = await sql.query`
            SELECT DISTINCT c.color_id, c.color_name 
            FROM Quantity q
            JOIN Color c ON q.color_id = c.color_id
            WHERE q.shoes_id = ${shoeId} AND q.quantity > 0
        `;

        // Lấy các kích cỡ có sẵn
        const sizes = await sql.query`
            SELECT DISTINCT s.size_id, s.size_name 
            FROM Quantity q
            JOIN Size s ON q.size_id = s.size_id
            WHERE q.shoes_id = ${shoeId} AND q.quantity > 0
        `;

        // Lấy tồn kho chi tiết
        const quantities = await sql.query`
            SELECT q.*, c.color_name, s.size_name 
            FROM Quantity q
            JOIN Color c ON q.color_id = c.color_id
            JOIN Size s ON q.size_id = s.size_id
            WHERE q.shoes_id = ${shoeId}
        `;

        const response = {
            ...product.recordset[0],
            images: images.recordset.map(i => i.image_url),
            availableColors: colors.recordset,
            availableSizes: sizes.recordset,
            quantities: quantities.recordset,
            brand: product.recordset[0].brand_name,
            category: product.recordset[0].category_name
        };

        res.json(response);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    } finally {
        sql.close();
    }
});

export { router as productRouter };