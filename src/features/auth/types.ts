export type UserRole = "passenger" | "driver" | "rental-owner" | "fleet-owner";

export type Account = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  /** Only meaningful for the rental-owner role — optional business name shown on their listings. */
  businessName?: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
};
