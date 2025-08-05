import { supabase } from "../../supabase/supabaseClient";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

import PostCard from "../components/PostCard";

export default function HomePage() {
  const { posts } = useGlobalContext();

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
