const request = require('supertest')
const { Match, sequelize } = require('../models');
const { queryInterface } = sequelize


const testMatch = () => {
  return {
    opponent: 'testFC',
    opponentLogo: 'www.test.com',
    startDate: '2022-12-12'
  }
}

const matchTest = {
  opponent: 'testFC2',
  opponentLogo: 'www.test2.com',
  startDate: '2022-12-11'
}


beforeAll(async () => {
  await Match.create(testMatch())
})

beforeEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  try {
    await queryInterface.bulkDelete("Matches", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    })
  } catch (error) {
    console.log(error)
  }
})
describe('Test endpoint match', () => {
  describe('Get all /match', () => {
    test('Succes read match , status code 200', () => {
      return (
        request(app)
          .get('/match')
          .then((response) => {
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBeGreaterThan(0);
            expect(Array.isArray(response.body)).toBeTruthy()
          })
      )
    })
    test('Failed read match , status code 500', (done) => {
      jest.spyOn(Match, "findAll").mockRejectedValue(new Error("test error"))
      request(app)
        .get('/match')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(500);
          return done();
        })
    })
  })
  describe('Get /match/:matchId', () => {
    test("Succes get matchById , status code 200", (done) => {
      request(app)
        .get("/match/1")
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(200);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("id", expect.any(Number));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test("Failed get matchById , status code 404", (done) => {
      request(app)
        .get("/match/2")
        .then((response) => {
          const { body, status } = response;
          expect(status).toBe(404);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", "Match not found");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
    test('Failed get matchById , status code 500', (done) => {
      jest.spyOn(Match, "findAll").mockRejectedValue(new Error("test error"))
      request(app)
        .get('/match/1')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(500);
          return done();
        })
    })
  })
  describe('POST /match', () => {
    test('Success add match , status code 201', (done) => {
      request(app)
        .post('/match')
        .send(matchTest)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", 'succes');
          return done();
        });
    })
    test('failed add match opponent null , status code 400', (done) => {
      request(app)
        .post('/match')
        .send({
          opponentLogo: 'www.test3.com',
          startDate: '2022-12-11'
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", 'opponent is required');
          return done();
        });
    })
    test('failed add match opponent empty , status code 400', (done) => {
      request(app)
        .post('/match')
        .send({
          opponent: '',
          opponentLogo: 'www.test3.com',
          startDate: '2022-12-11'
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", 'opponent is required');
          return done();
        });
    })
    test('failed add match opponentLogo null , status code 400', (done) => {
      request(app)
        .post('/match')
        .send({
          opponent: 'testFC2',
          startDate: '2022-12-11'
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", 'opponentLogo is required');
          return done();
        });
    })
    test('failed add match opponentLogo empty , status code 400', (done) => {
      request(app)
        .post('/match')
        .send({
          opponent: 'testFC2',
          opponentLogo: '',
          startDate: '2022-12-11'
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", 'opponentLogo is required');
          return done();
        });
    })
    test('failed add match startDate null , status code 400', (done) => {
      request(app)
        .post('/match')
        .send({
          opponent: 'testFC2',
          opponentLogo: 'www.test2.com',
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", 'startDate is required');
          return done();
        });
    })
    test('failed add match startDate empty , status code 400', (done) => {
      request(app)
        .post('/match')
        .send({
          opponent: 'testFC2',
          opponentLogo: 'www.test2.com',
          startDate: ''
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(400);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message", 'startDate is required');
          return done();
        });
    })
    test('Failed read match , status code 500', (done) => {
      jest.spyOn(Match, "create").mockRejectedValue(new Error("test error"))
      request(app)
        .post('/match')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(500);
          return done();
        })
    })
  })
  describe('Patch /match', () => {
    test('success update result', (done) => {
      Match.create(matchTest).then((result) => {
        request(app)
          .patch(`/match/${result.id}`)
          // .set('access_token', token)
          .send({
            result: '2-0'
          })
          .end((err, res) => {
            if (err) return done(err);
            const { body, status } = res;
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Object));
            expect(body).toHaveProperty("message");
            return done();
          });
      });
    })
    test('failed update result match not found', (done) => {
      request(app)
        .patch(`/match/99`)
        // .set('access_token', token)
        .send({
          result: '2-0'
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(404);
          expect(body).toEqual(expect.any(Object));
          expect(body).toHaveProperty("message");
          return done();
        });
    })
    test('Failed update match , status code 500', (done) => {
      jest.spyOn(Match, "update").mockRejectedValue(new Error("test error"))
      request(app)
        .patch('/match/1')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(500);
          return done();
        })
    })
  })
})




//
// opponent: 'testFC2',
// opponentLogo: 'www.test2.com',
// startDate: '2022-12-11'