import { Request } from "express";
import { FilteredUser } from "../models/dtos/user_dto";

export interface AuthenticatedRequest extends Request {
  user?: FilteredUser;
}
