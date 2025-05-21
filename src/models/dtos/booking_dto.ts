import { booking_status } from "@prisma/client";

/**
 * @openapi
 * components:
 *   schemas:
 *     PropertyData:
 *       type: object
 *       properties:
 *         cluster:
 *           type: string
 *           example: Treasure Island
 *         product:
 *           type: string
 *           example: Alexandrite
 *         unit:
 *           type: string
 *           example: A1
 *     CustomerData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: James
 *         identification_number:
 *           type: string
 *           example: "1111111111111111"
 *         phones:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "0812345678910"
 *             - "0810987654321"
 *     BriefBooking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         customer_name:
 *           type: string
 *           example: James
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: pending
 *         created_at:
 *           type: Date
 *           example: 2025-05-19T17:09:50.000Z
 *         property_data:
 *           $ref: '#/components/schemas/PropertyData'
 *     BookingDetail:
 *       type: object
 *       properties:
 *         dp_price:
 *           type: number
 *           example: 200000000
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: pending
 *         created_at:
 *           type: Date
 *           example: 2025-05-19T17:09:50.000Z
 *         customer_data:
 *           $ref: '#/components/schemas/CustomerData'
 *         property_data:
 *           $ref: '#/components/schemas/PropertyData'
 */

export interface AddBookingData {
  unit_id: number;
  user_id: number;
  customer_id: number;
  dp_price: number;
}

export interface AddBookingRequest {
  customer_name: string;
  identification_number: string;
  phone: string;
  dp_price: number;
  unit_id: number;
}

export interface BriefBooking {
  id: number;
  customer_name: string;
  status: booking_status;
  created_at: Date;
  property_data: PropertyData;
}

export interface BookingDetail {
  dp_price: number;
  status: booking_status;
  created_at: Date;
  customer_data: CustomerData;
  property_data: PropertyData;
}

export interface UpdateBookingRequest {
  booking_id: number;
  status: booking_status;
}

interface CustomerData {
  name: string;
  identification_number: string;
  phones: string[];
}

interface PropertyData {
  cluster: string;
  product: string;
  unit: string;
}
