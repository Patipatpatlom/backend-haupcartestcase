require('dotenv').config();
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('../generated/prisma/index.js');

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
