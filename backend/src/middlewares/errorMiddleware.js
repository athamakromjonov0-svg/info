export const notFound = (req, res, next) => {
  const error = new Error(`Topilmadi: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Serverda ichki xatolik yuz berdi",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
