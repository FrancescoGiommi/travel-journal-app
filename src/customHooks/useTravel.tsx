import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { isTravelPost } from "../../typeGuard/typeGuard";
import type { TravelPost } from "../../types";

export function useTravel() {
  const [posts, setPosts] = useState<TravelPost[]>([]);

  async function fetchPosts(): Promise<TravelPost[] | null> {
    try {
      const { data, error } = await supabase
        .from("japan_travel_posts")
        .select("*");

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      // Type guard come prima
      const validPosts = data.filter(isTravelPost);

      console.log(validPosts);
      return validPosts;
    } catch (error) {
      console.error("Errore nella fetch con supabase:", error);
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
    nightlife: { color: "dark", icon: "🌃" },
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
    ParcoDivertimenti: { color: "success", icon: "🎢" },
    storia: { color: "secondary", icon: "📜" },
    arte: { color: "danger", icon: "🎨" },
    zen: { color: "success", icon: "🪷" },
    giardini: { color: "success", icon: "🌸" },
    kyoto: { color: "warning", icon: "🏯" },
    bambù: { color: "success", icon: "🎋" },
    panorama: { color: "primary", icon: "🌅" },
    Osaka: { color: "danger", icon: "🌆" },
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

  const tagsList: Record<string, string> = {
    nightlife: "🌃",
    città: "🏙️",
    natura: "🌿",
    templi: "⛩️",
    spiritualità: "🕊️",
    cibo: "🍜",
    divertimento: "🎉",
    animali: "🐾",
    relax: "🛀",
    shopping: "🛍️",
    cultura: "📚",
    musei: "🏛️",
    mare: "🌊",
    tecnologia: "💻",
    anime: "🎌",
    tradizione: "🏮",
    parcoDivertimenti: "🎢",
    storia: "📜",
    arte: "🎨",
    zen: "🪷",
    giardini: "🌸",
    kyoto: "🏯",
    bambù: "🎋",
    panorama: "🌅",
    osaka: "🌆",
    castelli: "🏰",
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

  // Funzione per colorare i tag in base al costo
  const expenceTagsColor = (expence: number) => {
    if (expence <= 20) {
      return <span className="badge text-bg-success">{expence} €</span>;
    } else if (expence <= 60) {
      return <span className="badge text-bg-warning">{expence} €</span>;
    } else {
      return <span className="badge text-bg-danger">{expence} €</span>;
    }
  };

  return { posts, renderTags, humorIcons, tagsList, expenceTagsColor };
}
