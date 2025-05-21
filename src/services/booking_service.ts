import { AddBookingData, BookingDetail, BriefBooking } from "../models/dtos/booking_dto";
import { booking_status, product_unit_status } from "@prisma/client";
import db from "../configs/database";

export async function getAllBookings(user_id: number): Promise<BriefBooking[]> {
  const rows = await db.bookings.findMany({
    where: { user_id },
    select: {
      id: true,
      status: true,
      created_at: true,
      customers: {
        select: { name: true },
      },
      product_units: {
        select: {
          name: true,
          products: {
            select: {
              name: true,
              clusters: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  const processedRows = rows.map((row) => {
    const { customers, product_units, ...rest } = row;
    const propertyData = {
      cluster: product_units.products.clusters.name,
      product: product_units.products.name,
      unit: product_units.name,
    };

    return {
      ...rest,
      customer_name: customers.name,
      property_data: propertyData,
    };
  });
  return processedRows;
}

export async function getBookingById(id: number, user_id?: number): Promise<BookingDetail | null> {
  const row = await db.bookings.findUnique({
    where: { id, user_id },
    select: {
      dp_price: true,
      status: true,
      created_at: true,
      customers: {
        select: {
          name: true,
          identification_number: true,
          phones: {
            orderBy: { created_at: "desc" },
            select: { phone: true },
          },
        },
      },
      product_units: {
        select: {
          name: true,
          products: {
            select: {
              name: true,
              clusters: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!row) return null;
  const { dp_price, customers, product_units, ...rest } = row;

  const customerData = {
    name: customers.name,
    identification_number: customers.identification_number,
    phones: customers.phones.map((row) => row.phone),
  };

  const propertyData = {
    cluster: product_units.products.clusters.name,
    product: product_units.products.name,
    unit: product_units.name,
  };

  const processedRow = {
    ...rest,
    dp_price: Number(dp_price),
    customer_data: customerData,
    property_data: propertyData,
  };
  return processedRow;
}

export async function createBooking(bookingData: AddBookingData): Promise<BookingDetail | null> {
  const result = await db.bookings.create({
    data: bookingData,
    select: { id: true },
  });
  await db.product_units.update({
    where: { id: bookingData.unit_id, status: "ready" },
    data: { status: "reserved" },
  });
  return getBookingById(result.id);
}

export async function updateBookingStatusById(id: number, status: booking_status): Promise<BookingDetail | null> {
  const result = await db.bookings.update({
    where: { id },
    data: { status },
    select: { unit_id: true },
  });
  if (status != "pending") {
    const unitStatus: product_unit_status = status == "completed" ? "sold" : "ready";
    await db.product_units.update({
      where: { id: result.unit_id, status: "reserved" },
      data: { status: unitStatus },
    });
  }
  return getBookingById(id);
}

export async function deleteBookingById(): Promise<void> {}
