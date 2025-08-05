import { supabase } from "../../supabase/supabaseClient";
import type { TravelPost } from "../../types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isTravelPost } from "../../typeGuard/typeGuard";
import PostCard from "../components/PostCard";

export default function HomePage() {
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

  return (
    <>
      <div className="container">
        <h1>Diario di viaggio</h1>

        <div className="row justify-content-center">
          {posts.map((post) => (
            <div
              key={post.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="card h-100">
                <Link
                  to={`/details/${post.id}`}
                  className="text-decoration-none text-dark"
                >
                  <PostCard
                    image={post.image}
                    title={post.title}
                    description={post.description}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
