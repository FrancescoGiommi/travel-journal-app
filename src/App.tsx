import "./App.css";
import { supabase } from "../supabase/supabaseClient";
import type { TravelPost } from "../types";
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState<TravelPost[]>([]);

  function isTravelPost(dati: unknown): dati is TravelPost {
    if (dati && typeof dati === "object") {
      const obj = dati as { [key: string]: unknown };

      const isValid =
        "titolo" in obj &&
        typeof obj.titolo === "string" &&
        "data" in obj &&
        typeof obj.data === "string" &&
        "luogo" in obj &&
        typeof obj.luogo === "string" &&
        "latitudine" in obj &&
        typeof obj.latitudine === "number" &&
        "longitudine" in obj &&
        typeof obj.longitudine === "number" &&
        "media_url" in obj &&
        typeof obj.media_url === "string" &&
        "descrizione" in obj &&
        typeof obj.descrizione === "string" &&
        "umore" in obj &&
        typeof obj.umore === "string" &&
        "riflessione_positiva" in obj &&
        typeof obj.riflessione_positiva === "string" &&
        "riflessione_negativa" in obj &&
        typeof obj.riflessione_negativa === "string" &&
        "impegno_fisico" in obj &&
        typeof obj.impegno_fisico === "number" &&
        "effort_economico" in obj &&
        typeof obj.effort_economico === "number" &&
        "spesa_euro" in obj &&
        typeof obj.spesa_euro === "number" &&
        "tags" in obj &&
        Array.isArray(obj.tags) &&
        obj.tags.every((tag) => typeof tag === "string");

      return isValid;
    }
    return false;
  }

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
    fetchPosts();
  }, []);
  return <></>;
}

export default App;
