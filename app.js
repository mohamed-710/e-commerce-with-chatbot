import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/Dbconfig.js'
import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

// Routes

app.use('/api/auth',authRoutes);

// 404 handler

// app.all('*',(req,res,next)=>{
//   return next (new Error ("Route not found",{cause:404}));
// })


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode=err.cause||500;
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

  app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });



