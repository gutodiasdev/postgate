import Jimp from "jimp";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { S3_ACCESS_KEY, S3_BUCKET_NAME, S3_SECRET_KEY } from "@/config";

const s3Client = new S3Client({
  region: "sa-east-1",
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  }
})

async function uploadFileToS3(file: any, filename: string): Promise<string> {
  const fileBuffer = file;
  const image = await Jimp.read(fileBuffer).then((image) => {
    image.resize(800, 800);
    return image.getBufferAsync("image/jpeg");
  })
  const [user, id, originalFileName] = filename.split("_");
  const key = `${user}_${id}/${Date.now()}_${originalFileName}.jpg`;
  const params: PutObjectCommandInput = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: image,
    ContentType: "image/jpg"
  }
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return `https://d4yfqrpu425xz.cloudfront.net/${key}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const userId = formData.get("userId") as string;
    if (!file) {
      return new NextResponse(JSON.stringify({ error: "File is required!" }), { status: 400 });
    }
    const blob = file.slice();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    const url = await uploadFileToS3(arrayBuffer, userId + "_image");

    return new NextResponse(JSON.stringify({ success: true, url }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}