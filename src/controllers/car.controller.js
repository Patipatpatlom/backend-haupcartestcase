const prisma = require('../prisma');

const create = async (req, res, next) => {
  try {
    const { licensePlate, brand, carModel, remarks } = req.body;

    if (!licensePlate || !brand || !carModel) {
      return res.status(400).json({ message: 'licensePlate, brand, and carModel are required.' });
    }

    const car = await prisma.car.create({
      data: { licensePlate, brand, carModel, remarks },
    });

    return res.status(200).json({ message: 'Car created successfully.', data: car });
  } catch (err) {
      next(err);
  }
};


const getAll = async (req, res, next) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json({ data: cars });
  } catch (err) {
    next(err);
  }
};


const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }

    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
      return res.status(404).json({ message: 'Car not found.' });
    }

    return res.status(200).json({ data: car });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }

    const { licensePlate, brand, carModel, remarks } = req.body;

    const car = await prisma.car.update({
      where: { id },
      data: { licensePlate, brand, carModel, remarks },
    });

    return res.status(200).json({ message: 'Car updated successfully.', data: car });
  } catch (err) {
    next(err);
  }
};


const deleteCar = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid car ID.' });
    }

    await prisma.car.delete({ where: { id } });

    return res.status(200).json({ message: 'Car deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getAll, getById, update, delete: deleteCar };
