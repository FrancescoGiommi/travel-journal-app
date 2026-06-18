export type PostImage = {
  id: number;
  created_at: string;
  post_id: number;
  image_url: string;
  position: number;
  is_cover: boolean;
};

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
  post_images?: PostImage[];
};

export type NewTravelPost = Omit<
  TravelPost,
  "id" | "latitude" | "longitude" | "post_images"
>;
