import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3, { bucketName } from "../configs/s3_client";
import crypto from "crypto";

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export function uploadFileToS3(fileContent: Buffer | string, contentType: string) {
  const uploadParams = {
    Bucket: bucketName,
    Key: randomImageName(),
    Body: fileContent,
    ContentType: contentType,
  };

  return s3.send(new PutObjectCommand(uploadParams));
}

export function downloadFileFromS3(fileName: string) {
  const downloadParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.send(new GetObjectCommand(downloadParams));
}

export function deleteFileFromS3(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3.send(new DeleteObjectCommand(deleteParams));
}