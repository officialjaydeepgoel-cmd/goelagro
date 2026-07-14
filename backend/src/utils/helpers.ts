import crypto from "crypto";

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const generateOtp = (length: number = 6): string => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

export const generateRfqNumber = (): string => {
  const prefix = "RFQ";
  const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

export const generateOrderNumber = (): string => {
  const prefix = "ORD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const generateQuoteNumber = (): string => {
  const prefix = "QTE";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const generateInvoiceNumber = (): string => {
  const prefix = "INV";
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${year}-${random}`;
};

export const calculateLeadScore = (
  hasCompany: boolean,
  hasPhone: boolean,
  hasEmail: boolean,
  requirementLength: number,
  quantity: string | null
): number => {
  let score = 0;
  if (hasCompany) score += 20;
  if (hasPhone) score += 15;
  if (hasEmail) score += 10;
  if (requirementLength > 50) score += 15;
  if (requirementLength > 200) score += 10;
  if (quantity) {
    const qty = parseInt(quantity);
    if (qty > 100) score += 20;
    else if (qty > 50) score += 10;
    else score += 5;
  }
  return Math.min(score, 100);
};

export function queryParam(val: unknown): string | undefined {
  if (typeof val === "string") return val;
  if (Array.isArray(val) && val.length > 0) return String(val[0]);
  return undefined;
}

export function paginateOptions(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return {
    skip,
    take: limit,
  };
}
