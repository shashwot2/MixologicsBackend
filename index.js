import express from "express";
import mongoose from 'mongoose';
import myBarRoutes from './src/routes/mybarRoutes.js'
import recipesRoute from './src/routes/RecipesRoutes.js'
import cors from 'cors'
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
dotenv.config();

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  endpoint: 'https://2515ff279dac29f9d12a447972f66fe5.r2.cloudflarestorage.com',
  forcePathStyle: true,
  region: "auto"
});


const app = express();
app.use(fileUpload());
app.use(express.json());
app.use(cors());


app.get('/', (request, response) => {
  console.log(request);
  response.status(200).send('Successful')
});

app.use('/api/mybar', myBarRoutes)
app.use('/api/recipes', recipesRoute)
// app.use('/api/recipeStaticAssets', recipeStaticAssetsRoute)
// app.use('/api/socialMediaPostData', socialMediaPostDataRoute)
// app.use('/api/socialMediaStaticAssets', socialMediaStaticAssetsRoute)
app.post('/api/upload', async (req, res) => {
  console.log(req.files);

  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.');
  }

  let userFile = req.files.file;

  const uploadParams = {
    Bucket: 'mixologics',
    Key: `uploads/${Date.now()}-${userFile.name}`,
    Body: userFile.data,
    ContentType: userFile.mimetype
  };

  try {
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: uploadParams
    });

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    await parallelUploads3.done();
    console.log('Upload completed successfully');
    res.send({ message: 'File Uploaded Successfully!', location: uploadParams.Key });
  } catch (err) {
    console.log('Error uploading:', err);
    res.status(500).send(err);
  }
});


mongoose
  .connect(process.env.mongo_URI)
  .then(() => {
    console.log('App connected to database');
    app.listen(process.env.PORT, () => {
      console.log(`APP is listening to port: 3000`)
    });
  })
  .catch((error) => {
    console.log(error);
  })
