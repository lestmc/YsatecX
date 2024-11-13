const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message,
      details: err.details
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: '未授权访问'
    });
  }

  if (err.name === 'FileUploadError') {
    return res.status(400).json({
      error: '文件上传失败',
      details: err.message
    });
  }

  res.status(500).json({
    error: '服务器内部错误',
    requestId: req.id
  });
};

module.exports = errorHandler; 