import { getLatestApk } from "../services/download_service";
import { Request, Response, NextFunction } from "express";

export async function fetchLatest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const apk = getLatestApk();
    res.redirect(apk);
  } catch (err) {
    next(err);
  }
}
