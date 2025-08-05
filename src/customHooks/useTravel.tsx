import { useEffect, useState } from "react";

import { isTravelPost } from "../../typeGuard/typeGuard";
import type { TravelPost } from "../../types";

export function useTravel() {
  const [posts, setPosts] = useState<TravelPost[]>([]);

  async function fetchPosts(): Promise<TravelPost[] | null> {
    try {
      const response = await fetch(
        "https://pdorueopvdnmydujmqzg.supabase.co/rest/v1/japan_travel_posts",
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Errore HTTP ${response.status} ${response.statusText}`
        );
      }

      const dati: unknown = await response.json();

      if (!Array.isArray(dati)) {
        throw new Error("Formato dei dati non valido: atteso un array");
      }

      const validPosts = dati.filter(isTravelPost);

      console.log(validPosts);
      return validPosts;
    } catch (error) {
      console.error("Errore nella fetch:", error);
      return null;
    }
  }

  useEffect(() => {
    fetchPosts().then((posts) => {
      if (posts) {
        setPosts(posts);
      }
    });
  }, []);

  return { posts };
}
