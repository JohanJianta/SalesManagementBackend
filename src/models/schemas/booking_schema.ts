import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     AddBookingInput:
 *       type: object
 *       required:
 *         - customer_name
 *         - identification_number
 *         - phone
 *         - dp_price
 *         - unit_id
 *       properties:
 *         customer_name:
 *           type: string
 *           example: James
 *         identification_number:
 *           type: string
 *           example: "1111111111111111"
 *         phone:
 *           type: string
 *           example: "0812345678910"
 *         dp_price:
 *           type: number
 *           example: 200000000
 *         unit_id:
 *           type: integer
 *           example: 1
 *     UpdateBookingInput:
 *       type: object
 *       required:
 *         - booking_id
 *         - status
 *       properties:
 *         booking_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: completed
 */

export const AddBookingSchema = z.object({
  customer_name: z
    .string({ required_error: "Customer name diperlukan", invalid_type_error: "Customer name harus berupa string" })
    .trim(),
  identification_number: z
    .string({
      required_error: "Identification number diperlukan",
      invalid_type_error: "Identification number harus berupa string",
    })
    .trim()
    .length(16, { message: "Identification number harus berjumlah 16 digit" })
    .regex(/^\d+$/, { message: "Identification number hanya boleh berisi angka" }),
  phone: z
    .string({ required_error: "Phone diperlukan", invalid_type_error: "Phone harus berupa string" })
    .trim()
    .max(13, { message: "Phone maksimal berjumlah 13 digit" })
    .regex(/^\d+$/, { message: "Phone hanya boleh berisi angka" }),
  dp_price: z.number({ required_error: "DP price diperlukan", invalid_type_error: "DP price harus berupa angka" }),
  unit_id: z.number({ required_error: "Unit ID diperlukan", invalid_type_error: "Unit ID harus berupa angka" }),
});

export const UpdateBookingSchema = z.object({
  booking_id: z.number({
    required_error: "Booking ID diperlukan",
    invalid_type_error: "Booking ID harus berupa angka",
  }),
  status: z.enum(["pending", "completed", "cancelled"], {
    errorMap: () => ({
      message: "Status harus salah satu dari: pending, completed, cancelled",
    }),
  }),
});
