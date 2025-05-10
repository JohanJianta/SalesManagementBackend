import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import "dotenv/config";

const accessKeyId = process.env.ACCESS_KEY_ID as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;

const cloudFront = new CloudFrontClient({
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export default cloudFront;