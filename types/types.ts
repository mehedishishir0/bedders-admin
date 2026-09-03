export type PlanType = "montly" | "Monthly" | "Yearly";
export type UserRole = "Company" | "Agency" | "Supplier" | "Provider" | "Carer";
export type StatusType = "Active" | "Inactive";

export interface PlanUserItem {
  id: string;
  plan: PlanType;
  user: string;
  role: UserRole;
  email: string;
  expiryDate: string;
  status: StatusType;
  location: string;
  // Details for View/Edit
  title?: string;
  price?: string;
  billingFrequency?: "Monthly" | "Yearly" | "Monthly/Yearly";
  description?: string;
  features?: string[];
}

export interface PlanFormData {
  title: string;
  price: string;
  billingFrequency: "Monthly" | "Yearly" | "Monthly/Yearly";
  content: string;
  isPopular?: boolean;
}