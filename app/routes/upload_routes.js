const express = require('express')
const Upload = require('../models/upload')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const promiseS3Upload = require('../../lib/s3Upload.js')

// INDEX
// GET /uploads
router.get('/uploads', (req, res, next) => {
  Upload.find()
    .then(uploads => {
      return uploads.map(upload => upload.toObject())
    })
    .then(uploads => res.status(200).json({ uploads: uploads }))
    .catch(next)
})

// SHOW
// GET /uploads/5a7db6c74d55bc51bdf39793
router.get('/uploads/:id', (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => res.status(200).json({ upload: upload.toObject() }))
    .catch(next)
})

// CREATE
// POST /uploads
router.post('/uploads', upload.single('image'), (req, res, next) => {
  promiseS3Upload()
  Upload.create(req.body.upload)
    .then(upload => {
      res.status(201).json({ upload: upload.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /uploads/5a7db6c74d55bc51bdf39793
router.patch('/uploads/:id', removeBlanks, (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      return upload.update(req.body.upload)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /uploads/5a7db6c74d55bc51bdf39793
router.delete('/uploads/:id', (req, res, next) => {
  Upload.findById(req.params.id)
    .then(handle404)
    .then(upload => {
      upload.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
