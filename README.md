

# Express.js MongoDB and AWS

int this read me I will be discussing the backend side of my project which is an image hosting website

## Databases Relationships

My database is made of two tables Users and images. 
1. the user can have upload and delete multiple images.
2. the user can add tags to and image.
3. the user can get a list of all his images and navigate to a singular image
4. the user can search all images by tags
5. an unsigned user can only search for images by tag and can view only the image in a new tab.

## AWS Storage

I have used an exisiting bucket on AWS storage. I have imported multer to enable image upload and send them to AWS bucket. the link to aws is stored in the database with each user in MongoDB.

## API

I have made the following routes in my uploads routes file as follows. The route to return images by tag is special as it does not require user authentication  hence I had to modify it slightly so it will accept a tag and return a collection of uploads who have the same tag.

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/uploads`             | `create#upload`    |
| GET   | `/uploads`             | `get#all-user-uploads`    |
| GET   | `/uploads/tag/s=:word`             | `get#uploads-by-tag`    |
| GET  | `/uploads/:id` | `get#single-upload-by-id`  |
| PUT  | `/uploads/:id` | `update#adds-tag-to-image`  |
| DELETE | `/uploads/:id`        | `delete#single-upload`   |

## Sample Code
### Tag Search route
```
router.get('/uploads/tag/s=:word', (req, res, next) => {
  Upload.find({"tags.tag":req.params.word})
    .then(uploads => {
      return uploads.map(upload => upload.toObject())
    })
    .then(uploads => res.status(200).json({ uploads: uploads }))
    .catch(next)
})
```
