exports.getHome = (req, res) => {
  res.status(200).json({
    message: 'Welcome to Haupcar Test API!',
    status: 'success'
  });
};
