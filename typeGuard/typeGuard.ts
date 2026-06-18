import type { TravelPost } from "../types";

// Funzione di type guard per TravelPost
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
      (typeof obj.latitude === "number" || obj.latitude === null) &&
      "longitude" in obj &&
      (typeof obj.longitude === "number" || obj.longitude === null) &&
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
      (typeof obj.physical_commitment === "number" ||
        obj.physical_commitment === null) &&
      "economic_effort" in obj &&
      (typeof obj.economic_effort === "number" ||
        obj.economic_effort === null) &&
      "expence_euro" in obj &&
      (typeof obj.expence_euro === "number" || obj.expence_euro === null) &&
      "tags" in obj &&
      Array.isArray(obj.tags) &&
      obj.tags.every((tag) => typeof tag === "string") &&
      (!("post_images" in obj) ||
        obj.post_images === null ||
        (Array.isArray(obj.post_images) &&
          obj.post_images.every((image) => {
            if (!image || typeof image !== "object") return false;

            const postImage = image as { [key: string]: unknown };

            return (
              "id" in postImage &&
              typeof postImage.id === "number" &&
              "created_at" in postImage &&
              typeof postImage.created_at === "string" &&
              "post_id" in postImage &&
              typeof postImage.post_id === "number" &&
              "image_url" in postImage &&
              typeof postImage.image_url === "string" &&
              "position" in postImage &&
              typeof postImage.position === "number" &&
              "is_cover" in postImage &&
              typeof postImage.is_cover === "boolean"
            );
          })));
    return isValid;
  }
  return false;
}

export { isTravelPost };
