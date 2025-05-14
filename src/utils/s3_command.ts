import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import cloudFront from "../configs/cloudfront_client";
import s3 from "../configs/s3_client";
import crypto from "crypto";
import path from "path";
import "dotenv/config";
import fs from "fs";

const bucketName = process.env.BUCKET_NAME as string;
const privateKeyPath = process.env.CLOUDFRONT_PRIVATE_KEY_PATH as string;
const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID as string;
const domainURL = process.env.CLOUDFRONT_URL as string;
const distId = process.env.CLOUDFRONT_DISTRIBUTION_ID as string;

const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export async function uploadFileToS3(fileContent: Buffer | string, contentType: string, folderName: string) {
  const filePath = `${folderName}/${randomFileName()}`;
  const uploadParams = {
    Bucket: bucketName,
    Key: filePath,
    Body: fileContent,
    ContentType: contentType,
  };

  await s3.send(new PutObjectCommand(uploadParams));
  return filePath;
}

export function getFileFromS3(fileName: string) {
  return getSignedUrl({
    url: domainURL + fileName,
    dateLessThan: new Date(Date.now() + 1000 * 3600 * 24),
    privateKey: fs.readFileSync(path.resolve(privateKeyPath), "utf8"),
    keyPairId: keyPairId,
  });
}

export function deleteFileFromS3(fileName: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };
  s3.send(new DeleteObjectCommand(deleteParams));

  const invalidationParams = {
    DistributionId: distId,
    InvalidationBatch: {
      CallerReference: fileName,
      Paths: {
        Quantity: 1,
        Items: ["/" + fileName],
      },
    },
  };
  return cloudFront.send(new CreateInvalidationCommand(invalidationParams));
}
