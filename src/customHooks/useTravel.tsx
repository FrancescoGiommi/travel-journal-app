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

  const tagStyles: Record<string, { color: string; icon: string }> = {
    "vita notturna": { color: "dark", icon: "🌃" },
    città: { color: "primary", icon: "🏙️" },
    natura: { color: "success", icon: "🌿" },
    templi: { color: "warning", icon: "⛩️" },
    spiritualità: { color: "info", icon: "🕊️" },
    cibo: { color: "danger", icon: "🍜" },
    divertimento: { color: "secondary", icon: "🎉" },
    animali: { color: "success", icon: "🐾" },
    relax: { color: "info", icon: "🛀" },
    shopping: { color: "secondary", icon: "🛍️" },
    cultura: { color: "secondary", icon: "📚" },
    musei: { color: "primary", icon: "🏛️" },
    mare: { color: "info", icon: "🌊" },
    tecnologia: { color: "dark", icon: "💻" },
    anime: { color: "warning", icon: "🎌" },
    tradizione: { color: "danger", icon: "🏮" },
    "parco a tema": { color: "success", icon: "🎢" },
    famiglia: { color: "primary", icon: "👨‍👩‍👧‍👦" },
    storia: { color: "secondary", icon: "📜" },
    arte: { color: "danger", icon: "🎨" },
    zen: { color: "success", icon: "🪷" },
    giardini: { color: "success", icon: "🌸" },
    kyoto: { color: "warning", icon: "🏯" },
    bambù: { color: "success", icon: "🎋" },
    riflessione: { color: "info", icon: "💭" },
    panorama: { color: "primary", icon: "🌅" },
    Osaka: { color: "danger", icon: "🌆" },
    architettura: { color: "secondary", icon: "🏗️" },
    tramonto: { color: "warning", icon: "🌇" },
    castelli: { color: "primary", icon: "🏰" },
  };

  const humorIcons: Record<string, string> = {
    Felice: "😊",
    Rilassato: "😌",
    Sorpreso: "😲",
    Entusiasta: "🤩",
    Eccitato: "😃",
    Affascinato: "😍",
    Riflessivo: "🤔",
    Ammirato: "👏",
    Sereno: "🌿",
    Impressionato: "😮",
    Curioso: "🧐",
  };

  function renderTags(tags: string[]) {
    return tags.map((tag) => {
      tag.trim().toLocaleLowerCase();
      const { color, icon } = tagStyles[tag] || {
        color: "secondary",
        icon: "🏷️",
      };
      return (
        <span key={tag} className={`badge text-bg-${color} me-2`}>
          {icon} {tag}
        </span>
      );
    });
  }

  return { posts, renderTags, humorIcons };
}
