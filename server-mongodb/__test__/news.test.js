const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const News = require('../models/news');

const inputNews = () => {
  return {
    title : 'Testing',
    imgUrl : 'www.google.com',
    description : 'ini testing bisa apa nggak',
    tags : 'Untuk test'
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

afterAll(async()=> {
  // await dbDisconnect()
  //
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe ('test endpoint news', ()=> {
  describe('get /news', ()=> {
    test('success get data', async ()=> {
      const news = await News.create(inputNews())
      const res = await request(app).get('/news')
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    })
    test('failed get data' , async()=> {
      jest.spyOn(News,'find').mockRejectedValue(new Error('failed test get data'))
      const res = await request(app).get('/news')
      expect(res.statusCode).toEqual(500)
      expect(res.body).toEqual('failed test get data')
    })
  })
  describe('get /news/:newsId',()=> {
    test('succes get news by id', async ()=> {
      const news = await News.create(inputNews())
      const res = await request(app).get(`/news/${news.id}`)
      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toBe(news.title);
      expect(res.body.imgUrl).toBe(news.imgUrl);
      expect(res.body.description).toBe(news.description);
    })
    test('failed get news by id invalidId', async ()=> {
      const news = await News.create(inputNews())
      await News.findByIdAndDelete(news.id)
      const res = await request(app).get(`/news/${news.id}`)
      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('News Not Found')
    })
    test('failed get news by id 500', async ()=> {
      jest.spyOn(News,'findById').mockRejectedValue(new Error('failed test get newsById'))
      const news = await News.create(inputNews())
      const res = await request(app).get(`/news/${news.id}`)
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual('failed test get newsById')
    })
  })
  describe('POST /news' , ()=> {
    test('success add new news',async()=> {
      const mockNews = inputNews()
      const res = await request(app).post('/news').send(mockNews)
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('Success create a new News')
    })
    
    test('error empty field title',async()=>{
      const mockNews = inputNews()
      const res = await request(app).post("/news").send({
        
        imgUrl : mockNews.imgUrl,
        description : mockNews.description,
        tags : mockNews.tags
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test('error empty field imgUrl',async()=>{
      const mockNews = inputNews()
      const res = await request(app).post("/news").send({
        title: mockNews.title,
        description : mockNews.description,
        tags : mockNews.tags
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test('error empty field description',async()=>{
      const mockNews = inputNews()
      const res = await request(app).post("/news").send({
        title: mockNews.title,
        imgUrl : mockNews.imgUrl,
        tags : mockNews.tags
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test('error empty field tags',async()=>{
      const mockNews = inputNews()
      const res = await request(app).post("/news").send({
        title: mockNews.title,
        imgUrl : mockNews.imgUrl,
        description : mockNews.description,
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message')
    })
    test("Failed 500", async () => {
      const mockNews = inputNews();
      jest.spyOn(News, 'create').mockRejectedValue(new Error("test add news error 500"));
      const res = await request(app).post("/news").send(mockNews);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual("test add news error 500");
    });
  })
  describe ('Delete /news',()=> {
    test('success delete news',async()=> {
      const news = await News.create(inputNews());
      const res = await request(app).delete(`/news/${news.id}`).send();
      expect(res.statusCode).toEqual(200);
      let deletedNews = await News.findById(news.id)
      expect(deletedNews).toBeNull();
    })
    test("Failed delete news 500", async () => {
      const news = await News.create(inputNews());
      jest.spyOn(News, 'findByIdAndRemove').mockRejectedValue(new Error('test error 500'));
      const res = await request(app).delete(`/news/${news.id}`).send();
      expect(res.statusCode).toEqual(500);
    });
  })

})