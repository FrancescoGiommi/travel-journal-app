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
  const [sortOrderExpense, setSortOrderExpense] = useState("asc");

  const filterByTextAndHumorAndTags = posts.filter((post) => {
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

  // Lista finale dei giochi
  const orderByExpense = useMemo(() => {
    return filterByTextAndHumorAndTags.sort((a, b) => {
      if (sortOrderExpense === "asc") {
        return a.expense_euro - b.expense_euro;
      } else {
        return b.expense_euro - a.expense_euro;
      }
    });
  }, [filterByTextAndHumorAndTags, sortOrderExpense]);

  // Funzione per colorare i tag in base al costo
  const expenceTagsColor = (expence: number) => {
    if (expence <= 20) {
      return <p className="badge text-bg-success">{expence} €</p>;
    } else if (expence <= 60) {
      return <p className="badge text-bg-warning">{expence} €</p>;
    } else {
      return <p className="badge text-bg-danger">{expence} €</p>;
    }
  };
  return (
    <>
      <div className="container">
        <h1>Diario di viaggio</h1>

        <div className="d-flex mb-2">
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

        <div className="d-flex justify-content-between">
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
        </div>
        {/* Bottone per cambiare ordine alfabetico */}
        <div>
          <button
            className="btn btn-primary mb-2"
            onClick={() =>
              setSortOrderExpense((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            Ordine per <span className="badge text-bg-success">€</span>{" "}
            <span className="badge text-bg-warning">€€</span>{" "}
            <span className="badge text-bg-danger">€€€</span>
          </button>
        </div>
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
          {orderByExpense.map((post) => (
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
                    expense_euro={post.expense_euro}
                    expenceTagsColor={expenceTagsColor}
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
