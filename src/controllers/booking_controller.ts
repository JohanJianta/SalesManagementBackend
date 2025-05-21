import { createCustomer, createCustomerPhone, getCustomerByIdentificationNumber } from "../services/customer_service";
import { getAllBookings, getBookingById, createBooking, updateBookingStatusById } from "../services/booking_service";
import { AddBookingSchema, UpdateBookingSchema } from "../models/schemas/booking_schema";
import { AddBookingRequest, UpdateBookingRequest } from "../models/dtos/booking_dto";
import { AuthenticatedRequest } from "../middlewares/auth_middleware";
import { getProductUnitById } from "../services/product_service";
import { validateRequestBody } from "../utils/request_util";
import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/user_service";
import { AppError } from "../utils/app_error";

export async function fetchBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user) throw Error;

    const promotions = await getAllBookings(user.id);
    res.send(promotions);
  } catch (err) {
    next(err);
  }
}

export async function fetchBookingById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user) throw Error;

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw AppError.BadRequest("id", "ID booking tidak valid");

    const booking = await getBookingById(Number(id), user.id);
    if (!booking) throw AppError.NotFound("id", "Booking tidak ditemukan");
    res.send(booking);
  } catch (err) {
    next(err);
  }
}

export async function addBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user) throw Error;

    const existingUser = await getUserById(user.id);
    if (!existingUser) throw AppError.Unauthorized("authentication", "User tidak valid");

    const validatedData = validateRequestBody<AddBookingRequest>(req.body, AddBookingSchema);
    const existingCustomer = await getCustomerByIdentificationNumber(validatedData.identification_number);

    let customerId: number;
    if (!existingCustomer) {
      customerId = await createCustomer(
        validatedData.customer_name,
        validatedData.identification_number,
        validatedData.phone
      );
    } else {
      if (existingCustomer.name != validatedData.customer_name) {
        throw AppError.Conflict("name", "Name tidak sesuai dengan data terdaftar");
      }
      if (!existingCustomer.phones.includes(validatedData.phone)) {
        await createCustomerPhone(validatedData.phone, existingCustomer.id);
      }
      customerId = existingCustomer.id;
    }

    const existingUnit = await getProductUnitById(validatedData.unit_id);
    if (!existingUnit) throw AppError.NotFound("unit_id", "Unit tidak ditemukan");

    if (existingUnit.status != "ready") {
      const caused = existingUnit.status == "sold" ? "terjual" : "dipesan";
      throw AppError.Conflict("unit_id", `Unit sudah ${caused}`);
    }

    const bookingData = {
      dp_price: validatedData.dp_price,
      unit_id: existingUnit.id,
      user_id: existingUser.id,
      customer_id: customerId,
    };

    const bookingResult = await createBooking(bookingData);
    if (!bookingResult) throw Error;

    res.status(201).send(bookingResult);
  } catch (err) {
    next(err);
  }
}

export async function updateBookingStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user) throw Error;

    const validatedData = validateRequestBody<UpdateBookingRequest>(req.body, UpdateBookingSchema);
    const existingBooking = await getBookingById(validatedData.booking_id, user.id);
    if (!existingBooking) throw AppError.NotFound("id", "Booking tidak ditemukan");

    if (existingBooking.status != "pending") {
      const caused = existingBooking.status == "completed" ? "diselesaikan" : "dibatalkan";
      throw AppError.Conflict("booking_id", `Booking sudah ${caused}`);
    }

    const updatedData = await updateBookingStatusById(validatedData.booking_id, validatedData.status);
    if (!updatedData) throw Error;

    res.send(updatedData);
  } catch (err) {
    next(err);
  }
}

export function removeBookingById(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
