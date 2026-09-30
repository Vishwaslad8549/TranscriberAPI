// errorHandler.js
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  let message = err.message;
  if (err.code === 'LIMIT_FILE_SIZE') { status = 413; message = 'File too large (max 200MB)'; }

  if (status >= 500) console.error(err);
  
  res.status(status).json({
    message: status >= 500 ? 'Internal server error' : err.message,
  });
}
