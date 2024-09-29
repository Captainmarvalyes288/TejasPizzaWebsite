// import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
// import uniqid from 'uniqid';

// export async function POST(req) {
//   const data =  await req.formData();
//   if (data.get('file')) {
//     // upload the file
//     const file = data.get('file');

//     const s3Client = new S3Client({
//       region: 'us-east-1',
//       credentials: {
//         accessKeyId: process.env.MY_AWS_ACCESS_KEY,
//         secretAccessKey: process.env.MY_AWS_SECRET_KEY,
//       },
//     });

//     const ext = file.name.split('.').slice(-1)[0];
//     const newFileName = uniqid() + '.' + ext;

//     const chunks = [];
//     for await (const chunk of file.stream()) {
//       chunks.push(chunk);
//     }
//     const buffer = Buffer.concat(chunks);

//     const bucket = 'dawid-food-ordering';
//     await s3Client.send(new PutObjectCommand({
//       Bucket: bucket,
//       Key: newFileName,
//       ACL: 'public-read',
//       ContentType: file.type,
//       Body: buffer,
//     }));


//     const link = 'https://'+bucket+'.s3.amazonaws.com/'+newFileName;
//     return Response.json(link);
//   }
//   return Response.json(true);
// }

import { MongoClient } from 'mongodb';
import { GridFSBucket } from 'mongodb';
import uniqid from 'uniqid';

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    await client.connect();
    const db = client.db('PizzaStore');
    const bucket = new GridFSBucket(db);

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const newFileName = `${uniqid()}.${ext}`;

    // Read file stream
    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(newFileName, {
      contentType: file.type,
    });
    
    await new Promise((resolve, reject) => {
      uploadStream.end(buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Generate file URL
    const fileUrl = `/api/files/${newFileName}`;
    return Response.json({ url: fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return Response.json({ error: 'File upload failed' }, { status: 500 });
  } finally {
    await client.close();
  }
}