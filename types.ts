export type TravelPost = {
  id: number;
  title: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  image: string;
  description: string;
  humor: string;
  positive_reflection: string;
  negative_reflection: string;
  physical_commitment: number;
  economic_effort: number;
  expense_euro: number;
  tags: string[];
  new_image?: string[] | null;
};
