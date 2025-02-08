
import express from 'express'
import cors from 'cors'
import sql from 'mssql'

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const config = {
  user: 'sa',
  password:'123456',
  database: 'ShoeStore',
  server: 'localhost',

  options: {
    encrypt: false, 
    trustServerCertificate: false 
  }
};


app.get('/api/shoes', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Giay`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching shoes:', err);
    res.status(500).send('Server error');
  } finally {
    sql.close();
  }
});


app.get('/api/shoes/:maGiay', async (req, res) => {
  const shoeId = parseInt(req.params.maGiay, 10); // Chuyển sang số nguyên
  if (isNaN(shoeId)) {
    return res.status(400).send('Invalid shoe ID');
  }

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Giay WHERE maGiay = ${shoeId}`;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});