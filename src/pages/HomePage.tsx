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
  const [filterHumor, setFilterHumor] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filterByTextAndHumor = posts.filter((post) => {
    const matchesText = post.title
      .toLowerCase()
      .includes(searchBar.toLowerCase());
    const matchesHumor =
      !filterHumor.trim() ||
      post.humor.toLowerCase() === filterHumor.toLowerCase();

    const matchesTags = selectedTags.length
      ? selectedTags.every((tag) =>
          post.tags.some(
            (postTag) => postTag.toLowerCase() === tag.toLowerCase()
          )
        )
      : true;

    return matchesText && matchesHumor && matchesTags;
  });

  const debouncedSearch = useMemo(
    () => debounce<string>((value) => setSearchBar(value), 300),
    []
  );

  // Funzione per aggiungere un tag
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prevTag) => [...prevTag, tag]);
    }
  };

  // Funzione per rimuovere un tag
  const removeTag = (tag: string) => {
    setSelectedTags((prevTag) => prevTag.filter((t) => t !== tag));
  };

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
            value={filterHumor}
            onChange={(e) => {
              setFilterHumor(e.target.value);
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
        </div>

        {/* Select filtro per tags */}
        <select
          value=""
          onChange={(e) => {
            addTag(e.target.value);
          }}
          className="form-select mb-2"
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

        {/* Mostra i tags selezionati */}
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="btn btn-primary me-2 mt-2 mb-2"
            onClick={() => removeTag(tag)}
          >
            {tagsList[tag]} {tag} <span className="ms-1">x</span>
          </span>
        ))}

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
