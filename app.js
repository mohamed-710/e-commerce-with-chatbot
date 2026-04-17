import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/Dbconfig.js'
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import createInvoice from './utils/pdfInvoice.js'
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js';
import subCategoryRoutes from './routes/subCategory.routes.js';
import brandRoutes from './routes/brand.routes.js';
import cookieParser from 'cookie-parser';
import couponRoutes from './routes/coupon.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());
const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    {
      item: "TC 100",
      description: "Toner Cartridge",
      quantity: 2,
      amount: 6000
    },
    {
      item: "USB_EXT",
      description: "USB Cable Extender",
      quantity: 1,
      amount: 2000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};
createInvoice(invoice, "invoice.pdf");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Routes

app.use('/api/Auth', authRoutes);

app.use('/api/category', categoryRoutes);

app.use('/api/subCategory', subCategoryRoutes);

app.use('/api/brand', brandRoutes);

app.use('/api/coupon',couponRoutes);

app.use('/api/product',productRoutes);

app.use('/api/cart',cartRoutes);

app.use('/api/order',orderRoutes);

//@TODO MAKE middeleware for convert image to webap


// 404 handler
// app.all('*',(req,res,next)=>{
//   return next (new Error ("Route not found",{cause:404}));
// })


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.cause || 500;
  res.status(statusCode).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// app.use((req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// Start server
const PORT = process.env.PORT || 3000;


app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});



