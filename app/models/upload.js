const mongoose = require('mongoose')

const TagsSchema = new mongoose.Schema({
  tag: {
    type: String
    }}, 
  {
  timestamps: true
})

const uploadSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tags:[TagsSchema]
  },  
  {
  timestamps: true
})

module.exports = mongoose.model('Upload', uploadSchema)