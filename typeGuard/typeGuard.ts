import type { TravelPost } from "../types";

function isTravelPost(dati: unknown): dati is TravelPost {
  if (dati && typeof dati === "object") {
    const obj = dati as { [key: string]: unknown };

    const isValid =
      "id" in obj &&
      typeof obj.id === "number" &&
      "title" in obj &&
      typeof obj.title === "string" &&
      "date" in obj &&
      typeof obj.date === "string" &&
      "location" in obj &&
      typeof obj.location === "string" &&
      "latitude" in obj &&
      typeof obj.latitude === "number" &&
      "longitude" in obj &&
      typeof obj.longitude === "number" &&
      "image" in obj &&
      typeof obj.image === "string" &&
      "description" in obj &&
      typeof obj.description === "string" &&
      "humor" in obj &&
      typeof obj.humor === "string" &&
      "positive_reflection" in obj &&
      typeof obj.positive_reflection === "string" &&
      "negative_reflection" in obj &&
      typeof obj.negative_reflection === "string" &&
      "physical_commitment" in obj &&
      typeof obj.physical_commitment === "number" &&
      "economic_effort" in obj &&
      typeof obj.economic_effort === "number" &&
      "expense_euro" in obj &&
      typeof obj.expense_euro === "number" &&
      "tags" in obj &&
      Array.isArray(obj.tags) &&
      obj.tags.every((tag) => typeof tag === "string");

    return isValid;
  }
  return false;
}

export { isTravelPost };
