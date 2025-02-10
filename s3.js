import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY, AWS_BUCKET_NAME } from "./src/config.js";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({ 
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

export async function uploadFile(file, name) {
    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: name,
        Body: stream
    }

    const command = new PutObjectCommand(uploadParams);
    const result = await client.send(command);

    fs.unlinkSync(file.tempFilePath);
}

export async function getFileUrl(filename){
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
}
