import db from "../configs/database";

export async function createCustomer(name: string, identification_number: string, phone: string): Promise<number> {
  const result = await db.customers.create({
    data: {
      name,
      identification_number,
      phones: {
        connectOrCreate: {
          where: { phone },
          create: { phone },
        },
      },
    },
    select: { id: true },
  });
  return result.id;
}

export async function getCustomerByIdentificationNumber(identification_number: string) {
  const row = await db.customers.findUnique({
    where: { identification_number },
    select: {
      id: true,
      name: true,
      phones: {
        select: { phone: true },
      },
    },
  });

  if (!row) return null;
  const { phones, ...rest } = row;
  const phoneList = phones.map((row) => row.phone);

  return { ...rest, phones: phoneList };
}

export async function createCustomerPhone(phone: string, customer_id: number) {
  await db.phones.create({
    data: { phone, customer_id },
  });
}
