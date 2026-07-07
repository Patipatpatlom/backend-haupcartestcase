const prisma = require('../../prisma');
const carController = require('../car.controller');

jest.mock('../../prisma', () => ({
  car: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  ...overrides,
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); 
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();


beforeEach(() => {
  jest.clearAllMocks();
});


describe('create', () => {
  test('ควร return 400 ถ้าไม่ส่ง licensePlate', async () => {
    const req = mockReq({ body: { brand: 'Toyota', carModel: 'Camry' } });
    const res = mockRes();

    await carController.create(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('ควร return 400 ถ้าไม่ส่ง brand', async () => {
    const req = mockReq({ body: { licensePlate: 'กข 1234', carModel: 'Camry' } });
    const res = mockRes();

    await carController.create(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('ควร return 200 และข้อมูลรถ เมื่อสร้างสำเร็จ', async () => {
    const fakeCar = { id: 1, licensePlate: 'กข 1234', brand: 'Toyota', carModel: 'Camry' };
    prisma.car.create.mockResolvedValue(fakeCar); 
    const req = mockReq({
      body: { licensePlate: 'กข 1234', brand: 'Toyota', carModel: 'Camry' },
    });
    const res = mockRes();

    await carController.create(req, res, mockNext);

    expect(prisma.car.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Car created successfully.',
      data: fakeCar,
    });
  });

  test('ควรเรียก next(err) เมื่อ prisma โยน error', async () => {
    const fakeError = new Error('DB error');
    prisma.car.create.mockRejectedValue(fakeError); 

    const req = mockReq({
      body: { licensePlate: 'กข 1234', brand: 'Toyota', carModel: 'Camry' },
    });
    const res = mockRes();

    await carController.create(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(fakeError);
  });
});


describe('getAll', () => {
  test('ควร return 200 และ list รถทั้งหมด', async () => {
    const fakeCars = [
      { id: 1, brand: 'Toyota' },
      { id: 2, brand: 'Honda' },
    ];
    prisma.car.findMany.mockResolvedValue(fakeCars);

    const req = mockReq();
    const res = mockRes();

    await carController.getAll(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: fakeCars });
  });

  test('ควรเรียก next(err) เมื่อ prisma โยน error', async () => {
    prisma.car.findMany.mockRejectedValue(new Error('DB error'));

    await carController.getAll(mockReq(), mockRes(), mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});


describe('getById', () => {
  test('ควร return 400 ถ้า id ไม่ใช่ตัวเลข', async () => {
    const req = mockReq({ params: { id: 'abc' } });
    const res = mockRes();

    await carController.getById(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid car ID.' });
  });

  test('ควร return 404 ถ้าไม่พบรถ', async () => {
    prisma.car.findUnique.mockResolvedValue(null); 

    const req = mockReq({ params: { id: '999' } });
    const res = mockRes();

    await carController.getById(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Car not found.' });
  });

  test('ควร return 200 และข้อมูลรถ ถ้าเจอ', async () => {
    const fakeCar = { id: 1, brand: 'Toyota' };
    prisma.car.findUnique.mockResolvedValue(fakeCar);

    const req = mockReq({ params: { id: '1' } });
    const res = mockRes();

    await carController.getById(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: fakeCar });
  });
});


describe('update', () => {
  test('ควร return 400 ถ้า id ไม่ใช่ตัวเลข', async () => {
    const req = mockReq({ params: { id: 'xyz' } });
    const res = mockRes();

    await carController.update(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('ควร return 200 และข้อมูลที่อัปเดต เมื่อสำเร็จ', async () => {
    const updatedCar = { id: 1, brand: 'Honda', carModel: 'Civic' };
    prisma.car.update.mockResolvedValue(updatedCar);

    const req = mockReq({
      params: { id: '1' },
      body: { brand: 'Honda', carModel: 'Civic' },
    });
    const res = mockRes();

    await carController.update(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Car updated successfully.',
      data: updatedCar,
    });
  });
});


describe('delete', () => {
  test('ควร return 400 ถ้า id ไม่ใช่ตัวเลข', async () => {
    const req = mockReq({ params: { id: '!!' } });
    const res = mockRes();

    await carController.delete(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('ควร return 200 เมื่อลบสำเร็จ', async () => {
    prisma.car.delete.mockResolvedValue({});

    const req = mockReq({ params: { id: '1' } });
    const res = mockRes();

    await carController.delete(req, res, mockNext);

    expect(prisma.car.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Car deleted successfully.' });
  });

  test('ควรเรียก next(err) เมื่อ prisma โยน error', async () => {
    prisma.car.delete.mockRejectedValue(new Error('DB error'));

    const req = mockReq({ params: { id: '1' } });
    const res = mockRes();

    await carController.delete(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
