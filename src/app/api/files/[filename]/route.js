import { MongoClient } from 'mongodb';
import { GridFSBucket } from 'mongodb';

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

export async function GET(req, { params }) {
  const filename = params.filename;
  try {
    await client.connect();
    const db = client.db('PizzaStore');
    const bucket = new GridFSBucket(db);

    const file = await bucket.find({ filename: filename }).toArray();
    if (!file || file.length === 0) {
      return new Response('File not found', { status: 404 });
    }

    const downloadStream = bucket.openDownloadStreamByName(filename);
    const chunks = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        'Content-Type': file[0].type,
        'Content-Length': file[0].length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('Error serving file', { status: 500 });
  } finally {
    await client.close();
  }
}



// import { MongoClient } from 'mongodb';
// import { GridFSBucket } from 'mongodb';
// import uniqid from 'uniqid';

// const uri = process.env.MONGO_URL;
// const client = new MongoClient(uri);

// export async function POST(req) {
//   try {
//     const data = await req.formData();
//     const file = data.get('file');

//     if (!file) {
//       return Response.json({ error: 'No file provided' }, { status: 400 });
//     }

//     await client.connect();
//     const db = client.db('PizzaStore');
//     const bucket = new GridFSBucket(db);

//     // Generate unique filename
//     const ext = file.name.split('.').pop();
//     const newFileName = `${uniqid()}.${ext}`;

//     // Read file stream
//     const chunks = [];
//     for await (const chunk of file.stream()) {
//       chunks.push(chunk);
//     }
//     const buffer = Buffer.concat(chunks);

//     // Upload to GridFS
//     const uploadStream = bucket.openUploadStream(newFileName, {
//       contentType: file.type,
//     });

//     await new Promise((resolve, reject) => {
//       uploadStream.end(buffer, (error) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve();
//         }
//       });
//     });

//     // Generate file URL (this will be a route to serve the file)
//     const fileUrl = `/api/files/${newFileName}`;

//     return Response.json({ url: fileUrl });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return Response.json({ error: 'File upload failed' }, { status: 500 });
//   } finally {
//     await client.close();
//   }
// }