export type TravelPost = {
  id: number;
  title: string;
  date: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  image: string;
  description: string;
  humor: string;
  positive_reflection: string;
  negative_reflection: string;
  physical_commitment: number | null;
  economic_effort: number | null;
  expence_euro: number | null;
  tags: string[];
};

export type NewTravelPost = Omit<TravelPost, "id" | "latitude" | "longitude">;
