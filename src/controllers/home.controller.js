const prisma = require('../prisma');

exports.getHome = async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    
    res.status(200).json({
      message: 'Welcome to Haupcar Test API!',
      status: 'success',
      database_connected: true,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
};
