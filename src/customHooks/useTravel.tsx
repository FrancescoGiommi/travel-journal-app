import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { isTravelPost } from "../../typeGuard/typeGuard";
import type { TravelPost } from "../../types";

export function useTravel() {
  const [posts, setPosts] = useState<TravelPost[]>([]);

  // Funzione per ottenere la lista dei post
  async function fetchPosts(): Promise<TravelPost[] | null> {
    try {
      const { data, error } = await supabase
        .from("japan_travel_posts")
        .select("*, post_images(*)");
      if (error) throw error;

      const validPosts = (data ?? [])
        .filter(isTravelPost)
        .map((post) => ({
          ...post,
          post_images: [...(post.post_images ?? [])].sort(
            (a, b) => a.position - b.position
          ),
        }));

      setPosts(validPosts);
      return validPosts;
    } catch (err) {
      console.error("Errore nella fetch:", err);
      return null;
    }
  }

  // Faccio la fetch al caricamento del componente
  useEffect(() => {
    fetchPosts().then((posts) => {
      if (posts) {
        setPosts(posts);
      }
    });
  }, []);

  // Funzione per formattare la data in gg/mm/aaaa
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  // Funzione per assegnare i badge e le icone ai tag
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
  const expenceTagsColor = (expence: number | null) => {
    if (expence === null) {
      return <span className="badge text-bg-secondary">N/D</span>;
    }

    if (expence <= 20) {
      return <span className="badge text-bg-success">{expence} €</span>;
    } else if (expence <= 60) {
      return <span className="badge text-bg-warning">{expence} €</span>;
    } else {
      return <span className="badge text-bg-danger">{expence} €</span>;
    }
  };

  // Tutti i tag con colori e icone
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

  // Tutte le icone per gli umori
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

  return {
    posts,
    renderTags,
    humorIcons,
    expenceTagsColor,
    fetchPosts,
    formatDate,
    tagStyles,
  };
}
