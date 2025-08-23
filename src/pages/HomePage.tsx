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
  const { posts, renderTags, humorIcons, tagsList, expenceTagsColor } =
    useGlobalContext();

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

  // Ordinamento per prezzo
  const orderByExpense = useMemo(() => {
    return filterByTextAndHumorAndTags.sort((a, b) => {
      if (a.expense_euro == null && b.expense_euro == null) return 0;
      if (a.expense_euro == null) return 1;
      if (b.expense_euro == null) return -1;

      if (sortOrderExpense === "asc") {
        return a.expense_euro - b.expense_euro;
      } else {
        return b.expense_euro - a.expense_euro;
      }
    });
  }, [filterByTextAndHumorAndTags, sortOrderExpense]);

  return (
    <>
      <h1 className="ms-5 pt-5 pb-3 text-light text-center">
        Diario di viaggio
      </h1>
      <div className="container">
        <div className="d-flex justify-content-around mb-2 gap-3">
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

        {/* Bottone per cambiare ordine in base al prezzo */}
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-primary mb-2 me-2"
            onClick={() =>
              setSortOrderExpense((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            Ordina per Prezzo:{" "}
            {sortOrderExpense === "asc" ? (
              <>
                <span className="badge text-bg-success">€</span>
                {" → "}
                <span className="badge text-bg-warning">€€</span>
                {" → "}
                <span className="badge text-bg-danger">€€€</span>
              </>
            ) : (
              <>
                <span className="badge text-bg-danger">€€€</span>
                {" → "}
                <span className="badge text-bg-warning">€€</span>
                {" → "}
                <span className="badge text-bg-success">€</span>
              </>
            )}
          </button>
          {/* Bottone per aggiungere un post */}
          <Link to={"/addPost"}>
            <button className="btn btn-primary mb-2">Aggiungi post</button>
          </Link>
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
              className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
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
