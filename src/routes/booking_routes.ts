import { authenticateUserRole } from "../middlewares/auth_middleware";
import { Router } from "express";
import {
  fetchBookings,
  fetchBookingById,
  addBooking,
  updateBookingStatus,
  removeBookingById,
} from "../controllers/booking_controller";

const router = Router();

/**
 * @openapi
 * paths:
 *   /bookings:
 *     get:
 *       tags:
 *         - Bookings
 *       summary: Get all bookings associated with the authenticated user
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BriefBooking'
 *         401:
 *           description: Unauthorized
 *         500:
 *           description: Internal Server Error
 */
router.get("/bookings", fetchBookings);

/**
 * @openapi
 * paths:
 *   /bookings/{id}:
 *     get:
 *       tags:
 *         - Bookings
 *       summary: Get booking detail by ID
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *             example: 1
 *           description: ID of the booking
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BookingDetail'
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized
 *         404:
 *           description: Not Found
 *         500:
 *           description: Internal Server Error
 */
router.get("/bookings/:id", fetchBookingById);

/**
 * @openapi
 * paths:
 *   /bookings:
 *     post:
 *       tags:
 *         - Bookings
 *       summary: Create a new pending booking
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddBookingInput'
 *       responses:
 *         201:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BookingDetail'
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized
 *         404:
 *           description: Not Found
 *         409:
 *           description: Conflict
 *         500:
 *           description: Internal Server Error
 */
router.post("/bookings", addBooking);

/**
 * @openapi
 * paths:
 *   /bookings:
 *     put:
 *       tags:
 *         - Bookings
 *       summary: Update pending booking
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateBookingInput'
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/BookingDetail'
 *         400:
 *           description: Bad Request
 *         401:
 *           description: Unauthorized
 *         404:
 *           description: Not Found
 *         409:
 *           description: Conflict
 *         500:
 *           description: Internal Server Error
 */
router.put("/bookings", updateBookingStatus);

router.delete("/bookings/:id", authenticateUserRole, removeBookingById);

export default router;
