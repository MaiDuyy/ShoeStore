import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './models/index.js';
import { productRouter } from './Router/product.routes.js';
import authRouter  from './Router/auth.routes.js';
import userRouter  from './Router/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Allow multiple client origins, comma-separated
const RAW_ORIGINS =
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_ORIGIN ||
  'http://localhost:3000,http://localhost:5173,http://localhost:8081,http://localhost:5000';
const ALLOWED_ORIGINS = RAW_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);



// Middlewares
const corsOptions = {
  methods : ['GET', 'PUT', 'POST'],
  credentials: true,
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser clients
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// app.use('/auth',adminRouter);
app.use('/auth',authRouter)
app.use('/user',userRouter)
app.use('/products',productRouter)

// DB connect
const localURI = process.env.MONGODB_LOCAL;
const atlasURI = process.env.MONGODB_URI;
async function connectDB() {
  try {
    console.log('🔍 Trying local MongoDB...');
    await mongoose.connect(localURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 2000, // timeout nhanh
    })
     .then(() => initial());
    console.log('✅ Connected to local MongoDB');
  } catch (localErr) {
    console.warn('⚠️ Local MongoDB not available, switching to Atlas...');
    try {
      await mongoose.connect(atlasURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => initial());
      console.log('🌍 Connected to MongoDB Atlas');
    } catch (atlasErr) {
      console.error('❌ Cannot connect to any MongoDB instance:', atlasErr.message);
      process.exit(1);
    }
  }
}

await connectDB();
function initial() {
    db.Role.estimatedDocumentCount()
        .then((count) => {
            if (count === 0) {
                return Promise.all([
                    new db.Role({ name: "user" }).save(),
                    new db.Role({ name: "admin" }).save(),
                    new db.Role({ name: "moderator" }).save(),
                ]);
            }
        })
        .then((roles) => {
            if (roles) {
                console.log(
                    "Added 'user', 'admin', and 'moderator' to roles collection.",
                );
            }
        })
        .catch((err) => {
            console.error("Error initializing roles:", err);
        });
}

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});
