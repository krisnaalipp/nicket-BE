const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
  title: {
    type: String,
    required : [true,'title is required'],
  },
  imgUrl: {
    type: String,
    required : [true,'imgUrl is required'],
  },
  description: {
    type: String,
    required : [true,'description is required'],
  },
  tags: {
    type: String,
    required : [true,'tags is required'],
  },

},
  {
    timestamps: true
  }
)

const News = mongoose.model('News',newsSchema)

module.exports = News
