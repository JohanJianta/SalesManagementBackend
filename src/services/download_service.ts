import { getFileFromS3 } from "../utils/s3_command";

export function getLatestApk(): string {
  return getFileFromS3("app-builds/SalesPropertyManagement-latest.apk");
}
