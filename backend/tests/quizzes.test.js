const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Quiz = require('../models/Quiz');

// Mock middlewares
jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => {
    // Generate a consistent user ID per test run, or randomly. 
    // Here we use a fresh ID so it simulates a non-creator by default.
    req.user = { id: '507f191e810c19729de860ea' };
    next();
  },
  authorize: () => (req, res, next) => next()
}));

jest.mock('../config/cloudinary', () => ({
  upload: {
    single: () => (req, res, next) => next()
  }
}));

const app = express();
app.use(express.json());
app.use('/api/quizzes', require('../routes/quizzes'));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Quiz.deleteMany({});
});

describe('Quizzes API - Private Quizzes', () => {
  it('should create a private quiz with a joinCode', async () => {
    const res = await request(app)
      .post('/api/quizzes')
      .send({
        title: 'Test Private Quiz',
        description: 'Testing private quizzes',
        timeLimit: 30,
        isPrivate: true,
        questions: []
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isPrivate).toBe(true);
    expect(res.body.data.joinCode).toBeDefined();
    expect(typeof res.body.data.joinCode).toBe('string');
  });

  it('should not expose private quizzes in the GET / route for other users', async () => {
    const creatorId = new mongoose.Types.ObjectId().toString();
    await Quiz.create({
      title: 'Private Quiz 1',
      description: 'Desc',
      timeLimit: 30,
      isPrivate: true,
      joinCode: 'ABCDEF',
      createdBy: creatorId
    });

    const res = await request(app).get('/api/quizzes');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBe(0);
  });

  it('should allow joining a private quiz via GET /api/quizzes/join/:code', async () => {
    const creatorId = new mongoose.Types.ObjectId().toString();
    const quiz = await Quiz.create({
      title: 'Private Quiz 2',
      description: 'Desc',
      timeLimit: 30,
      isPrivate: true,
      joinCode: 'XYZ123',
      createdBy: creatorId
    });

    const res = await request(app).get('/api/quizzes/join/XYZ123');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(quiz._id.toString());
  });
});
