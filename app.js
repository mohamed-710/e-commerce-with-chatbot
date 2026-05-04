import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/Dbconfig.js'
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js';
import subCategoryRoutes from './routes/subCategory.routes.js';
import brandRoutes from './routes/brand.routes.js';
import cookieParser from 'cookie-parser';
import couponRoutes from './routes/coupon.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import reviewRoutes from './routes/review.route.js';
import httpLogger from './middlewares/httpLogger.js';
import slowLogger from './middlewares/slowLogger.js';
import errorLogger from './middlewares/errorLogger.js';
import { corsMiddleware } from './config/corsConfig.js'
dotenv.config();

const app = express();

app.use(corsMiddleware);

app.use(express.json());

app.use(httpLogger);
app.use(slowLogger);

app.use(cookieParser());



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Routes

app.use('/api/Auth', authRoutes);

app.use('/api/category', categoryRoutes);

app.use('/api/subCategory', subCategoryRoutes);

app.use('/api/brand', brandRoutes);

app.use('/api/coupon', couponRoutes);

app.use('/api/product', productRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/order', orderRoutes);

app.use('/api/review', reviewRoutes);

//@TODO MAKE middeleware for convert image to webap


// 404 handler
// app.all('*',(req,res,next)=>{
//   return next (new Error ("Route not found",{cause:404}));
// })

// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });
app.use(errorLogger);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});



