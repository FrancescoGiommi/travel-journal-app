import { supabase } from "../../supabase/supabaseClient";

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

import PostCard from "../components/PostCard";

function debounce<T>(callback: (value: T) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (value: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(value);
    }, delay);
  };
}

export default function HomePage() {
  const { posts, renderTags } = useGlobalContext();

  const [searchBar, setSearchBar] = useState("");
  const [searchText, setSearchText] = useState("");

  const filteredPosts = posts.filter((post) => {
    return post.title.toLowerCase().includes(searchBar.toLocaleLowerCase());
  });

  const debouncedSearch = useMemo(
    () => debounce<string>((value) => setSearchBar(value), 300),
    []
  );

  return (
    <>
      <div className="container">
        <h1>Diario di viaggio</h1>

        <div className="mb-5">
          <form>
            <input
              className="form-control"
              type="text"
              placeholder="Cerca per testo.."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                debouncedSearch(e.target.value);
              }}
            />
          </form>
        </div>

        <div className="row justify-content-center">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="col-12 col-sm-6 col-md-4 col-lg-6 mb-4"
            >
              <div className="card h-100">
                <Link
                  to={`/details/${post.id}`}
                  className="text-decoration-none text-dark"
                >
                  <PostCard
                    image={post.image}
                    title={post.title}
                    tags={post.tags}
                    renderTags={renderTags}
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
