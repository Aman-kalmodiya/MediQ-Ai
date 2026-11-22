const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};


const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id';
  }
  if (err.code === 11000) {
    status = 409;
    message = 'Already exists (duplicate value)';
  }

  if (status === 500) console.error(err);

 
  const isProd = process.env.NODE_ENV === 'production';
  res.status(status).json({ message: status === 500 && isProd ? 'Server error' : message });
};

module.exports = { notFound, errorHandler };