const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Admin = require('../models/admin');
const{ signToken,verifyToken } = require('../helpers/jwt'); ;


const inputUser = () => {
  return {
    username : 'test',
    email : 'test@mail.com',
    password : '123456'
  }
}



beforeAll(async ()=> {
  // await dbConnect()
  await mongoose.connect('mongodb+srv://finalproject:semogalancar@cluster0.ymaqnui.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

afterEach(async()=> {
  jest.restoreAllMocks()
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  // await Admin.deleteMany()
})

// afterAll(async()=> {
//   // await dbDisconnect()
//   //
//   await mongoose.connection.dropDatabase()
//   await mongoose.connection.close()
// })


describe ('Admin API endpoint' , () => {
  describe('get/admin', ()=> {
    test('succes get data' , async ()=> {
      const admin = await Admin.create(inputUser())
      const res = await request(app).get('/admin')
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    })
    test('failed get data' , async()=> {
      jest.spyOn(Admin,'find').mockRejectedValue(new Error('failed test get data'))
      const res = await request(app).get('/admin')
      expect(res.statusCode).toEqual(500)
      expect(res.body).toEqual('failed test get data')
    })
  })

  describe('get /admin/:adminId',()=> {
    test('succes get admin by id', async ()=> {
      const admin = await Admin.create(inputUser())
      const res = await request(app).get(`/admin/${admin.id}`)
      expect(res.statusCode).toEqual(200);
      expect(res.body.username).toBe(admin.username);
      expect(res.body.email).toBe(admin.email);
    })
    test('failed get admin by id invalidId', async ()=> {
      const admin = await Admin.create(inputUser())
      await Admin.findByIdAndDelete(admin.id)
      const res = await request(app).get(`/admin/${admin.id}`)
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Admin Not Found')
    })
    test('failed get admin by id 500', async ()=> {
      jest.spyOn(Admin,'findById').mockRejectedValue(new Error('failed test get adminById'))
      const admin = await Admin.create(inputUser())
      const res = await request(app).get(`/admin/${admin.id}`)
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual('failed test get adminById')
    })
  })

  describe('POST /admin' , ()=> {
    test('success register admin',async()=> {
      const mockUser = inputUser()
      const res = await request(app).post('/admin').send(mockUser)
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('Success create a new Admin')
    })
    test('error register admin input',async()=> {
      const mockUser = inputUser()
      const res = await request(app).post("/admin").send({
        username: mockUser.username,
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test('error register admin input invalid email',async()=> {
      const mockUser = inputUser()
      const res = await request(app).post("/admin").send({
        username: mockUser.username,
        email: "invalid",
        password: mockUser.password,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test('error empty field username',async()=>{
      const mockUser = inputUser()
      const res = await request(app).post("/admin").send({
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test('error empty field email',async()=>{
      const mockUser = inputUser()
      const res = await request(app).post("/admin").send({
        username: mockUser.username,
        password: mockUser.password,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test('error empty field password',async()=>{
      const mockUser = inputUser()
      const res = await request(app).post("/admin").send({
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test("Failed 500", async () => {
      const mockAdmin = inputUser();
      jest.spyOn(Admin, 'create').mockRejectedValue(new Error("test add admin error 500"));
      const res = await request(app).post("/admin").send(mockAdmin);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual("test add admin error 500");
    });
  })

  describe ('Delete /admin',()=> {
    test('success delete admin',async()=> {
      const admin = await Admin.create(inputUser());
      const res = await request(app).delete(`/admin/${admin.id}`).send();
      expect(res.statusCode).toEqual(200);
      let deletedUser = await Admin.findById(admin.id)
      expect(deletedUser).toBeNull();
    })
    test("Failed delete admin 500", async () => {
      const admin = await Admin.create(inputUser());
      jest.spyOn(Admin, 'findByIdAndRemove').mockRejectedValue(new Error('test error 500'));
      const res = await request(app).delete(`/admin/${admin.id}`).send();
      expect(res.statusCode).toEqual(500);
    });
  })

    describe('Admin / login' , ()=> {
      test("successful", async () => {
        const mockAdmin = inputUser();
        const admin = await Admin.create(mockAdmin);
        const res = await request(app).post("/admin/login").send({email: mockAdmin.email, password: mockAdmin.password});
        expect(res.statusCode).toEqual(200);
        expect(res.body.access_token).toBeTruthy();
      });
      test("failed invalid input ", async () => {
        const mockAdmin = inputUser();
        const admin = await Admin.create(mockAdmin);
        const res = await request(app).post("/admin/login").send({ password: mockAdmin.password});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message')
      });
      test("failed invalid input ", async () => {
        const mockAdmin = inputUser();
        const admin = await Admin.create(mockAdmin);
        const res = await request(app).post("/admin/login").send({ email: mockAdmin.email});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message')
      });
      test("failed wrong email ", async () => {
        const mockAdmin = inputUser();
        const admin = await Admin.create(mockAdmin);
        const res = await request(app).post("/admin/login").send({ email: 'invalid@mail.com',password: mockAdmin.password});
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message')
      });
      test("failed wrong password ", async () => {
        const mockAdmin = inputUser();
        const admin = await Admin.create(mockAdmin);
        const res = await request(app).post("/admin/login").send({ email: mockAdmin.email,password: 'invalipassword'});
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message')
      });
      test("Failed 500 login error", async () => {
        const mockAdmin = inputUser();
        const admin = await Admin.create(mockAdmin);
        jest.spyOn(Admin, 'findOne').mockRejectedValue(new Error('test error 500 failed login'))
        const res = await request(app).post("/admin/login").send({email: mockAdmin.email, password: mockAdmin.password});
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual('test error 500 failed login');
      });
      test('verifyToken jwt helpers', async () => {
        const mockAdmin = inputUser();
        const admin = await Admin.create(mockAdmin);
        mockAdmin.id = admin.id;
        const token = signToken(mockAdmin);
        const payload = verifyToken(token);
        expect(payload.email).toBe(mockAdmin.email);
      });
    })

})