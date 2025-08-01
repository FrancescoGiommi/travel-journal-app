import { supabase } from "./supabaseClient.ts";
import { TravelPost } from "../types.ts";

export const createTravelPost = async (post: TravelPost) => {
  const { data, error } = await supabase.from("travel_posts").insert([post]);

  if (error) throw error;
  return data;
};

export const fetchAllPosts = async () => {
  const { data, error } = await supabase
    .from("travel_posts")
    .select("*")
    .order("data", { ascending: true });

  if (error) throw error;
  return data;
};
