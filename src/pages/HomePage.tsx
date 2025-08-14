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
  const { posts, renderTags, humorIcons, tagsList } = useGlobalContext();

  const [searchBar, setSearchBar] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredHumor, setFilteredHumor] = useState("");
  const [filteredTags, setFilteredTags] = useState("");

  const filterByTextAndHumor = posts.filter((post) => {
    const matchesText = post.title
      .toLowerCase()
      .includes(searchBar.toLowerCase());
    const matchesHumor =
      !filteredHumor.trim() ||
      post.humor.toLowerCase() === filteredHumor.toLowerCase();
    const matchesTags = post.tags.some((tag) => {
      return (
        !filteredTags.trim() || tag.toLowerCase() === filteredTags.toLowerCase()
      );
    });
    return matchesText && matchesHumor && matchesTags;
  });

  const debouncedSearch = useMemo(
    () => debounce<string>((value) => setSearchBar(value), 300),
    []
  );

  return (
    <>
      <div className="container">
        <h1>Diario di viaggio</h1>

        <div className="d-flex mb-5">
          {/* Input filtro per testo */}
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
          {/* Select filtro per stato d'animo */}
          <select
            value={filteredHumor}
            onChange={(e) => {
              setFilteredHumor(e.target.value);
            }}
            className="form-select"
            aria-label="Default select example"
          >
            <option value="">Cerca per stato d'animo</option>
            {Object.entries(humorIcons).map(([key, icon]) => (
              <option key={key} value={key}>
                {icon} {key}
              </option>
            ))}
          </select>

          {/* Select filtro per tags */}
          <select
            value={filteredTags}
            onChange={(e) => {
              setFilteredTags(e.target.value);
            }}
            className="form-select"
            aria-label="Default select example"
          >
            <option value="">Cerca per Tags</option>
            {Object.entries(tagsList).map(([key, icon]) => (
              <option key={key} value={key}>
                {icon}

                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="row justify-content-center">
          {filterByTextAndHumor.map((post) => (
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
                    humor={post.humor}
                    humorIcons={humorIcons}
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
