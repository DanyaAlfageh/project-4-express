const express = require('express')
const Upload = require('../models/upload')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const removeBlanks = require('../../lib/remove_blank_fields')
const router = express.Router()

// Require the multer middle library for handling multi-part requests
const multer = require('multer')

// Configure the upload object telling multer where we want to store the image
// temporarily on the server before sending it to aws.
const upload = multer({ dest: 'uploads/', storage: multer.memoryStorage() })

// Require our promisified s3Upload function.
const promiseS3Upload = require('../../lib/s3UploadApi.js')

// CREATE
// POST /uploads
// In our POST route for /uploads we include the multer middleware.
// The `single` method needs the name attribute from the form's input that has
// a type of file
router.post('/uploads', upload.single('image'), (req, res, next) => {
    console.log(req)
  // Invoke our promisified s3Upload function, passing in the req.file which is
  // an object that multer attached to the request object.
  promiseS3Upload(req.file)
 
    // This .then receives the response from aws if the upload was successful.
    .then(awsResponse => { console.log('amazzzooooon'+awsResponse)
      // Create an Upload document with the Location property from aws's
      // response.
      return Upload.create({url: awsResponse.Location})
    })
    // This .then receives the Mongo document from the DB.
    .then(upload => { console.log(upload)
      // Convert the document to json to send back to the client.
      res.status(201).json({ upload: upload.toObject() })
    })
    .catch(next)
})

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
