import express from 'express';
import config from '../utils/db.js';
import jwt from 'jsonwebtoken';
import sql from 'mssql';

const router = express.Router();

router.post("/userLogin", async (req, res) => {
    let pool;
    try {
        // ✅ Create a new connection pool
        pool = await sql.connect(config);

        // ✅ Use parameterized queries properly
        const result = await pool
            .request()
            .input("email", sql.NVarChar, req.body.email)
            .input("password", sql.NVarChar, req.body.password)
            .query("SELECT * FROM Customers WHERE email = @email AND pass = @password");

        if (result.recordset.length > 0) {
            const email = result.recordset[0].email;
            const token = jwt.sign(
                { role: "admin", email: email, id: result.recordset[0].id },
                "jwt_secret_key",
                { expiresIn: "1d" }
            );
            res.cookie("token", token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    } catch (err) {
        console.error("Database error:", err);
        return res.json({ loginStatus: false, Error: "Database connection error" });
    } finally {
        // ✅ Close the database connection after the request
        if (pool) {
            pool.close();
        }
    }
});

export { router as userRouter };