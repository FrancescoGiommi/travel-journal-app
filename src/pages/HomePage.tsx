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
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [sortOrderExpense, setSortOrderExpense] = useState<"asc" | "desc">(
    "asc"
  );
  const [sortOrderDate, setSortOrderDate] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"expence" | "date" | null>(null);

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

  // Ordinamento per prezzo e data
  const orderedPosts = useMemo(() => {
    return [...filterByTextAndHumorAndTags].sort((a, b) => {
      if (sortBy === "expence") {
        const expenceA = a.expence_euro ?? 0;
        const expenceB = b.expence_euro ?? 0;
        return sortOrderExpense === "asc"
          ? expenceA - expenceB
          : expenceB - expenceA;
      }

      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrderDate === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });
  }, [filterByTextAndHumorAndTags, sortBy, sortOrderExpense, sortOrderDate]);

  return (
    <>
      <h1 className="ms-5 pt-5 pb-3 text-light text-center">
        Diario di viaggio
      </h1>
      <div className="container">
        <div className="d-flex justify-content-between mb-2">
          <h2 className="text-light">Viaggio in Giappone</h2>
          {/* Bottone per aggiungere un post */}
          <div className="d-flex flex-column">
            <Link to={"/addPost"}>
              <button className="btn btn-primary mb-2">Aggiungi post</button>
            </Link>
            <button
              className="btn btn-primary rounded-3"
              onClick={() => setShowSearchMenu(!showSearchMenu)}
            >
              {showSearchMenu ? "Nascondi ricerca" : "Cerca/ordina post"}
            </button>
          </div>
        </div>
        {showSearchMenu && (
          <>
            <div className="d-flex justify-content-around mb-2 gap-3">
              <div className="d-flex flex-column w-100">
                <span className="text-light mb-1">Filtra per testo</span>
                {/* Input filtro per testo */}
                <input
                  className="form-control text-bg-dark"
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                />
              </div>
              <div className="d-flex flex-column w-100">
                <span className="text-light mb-1">
                  Filtra per stato d'animo
                </span>
                {/* Select filtro per stato d'animo */}
                <select
                  value={filterHumor}
                  onChange={(e) => {
                    setFilterHumor(e.target.value);
                  }}
                  className="form-select text-bg-dark"
                  aria-label="Default select example"
                >
                  <option value="">Seleziona un opzione</option>
                  {Object.entries(humorIcons).map(([key, icon]) => (
                    <option key={key} value={key}>
                      {icon} {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column w-100">
                <span className="text-light mb-1">Filtra per Tags</span>
                {/* Select filtro per tags */}
                <select
                  value=""
                  onChange={(e) => {
                    addTag(e.target.value);
                  }}
                  className="form-select text-bg-dark mb-2"
                  aria-label="Default select example"
                >
                  <option value="">Seleziona tag</option>
                  {Object.entries(tagsList).map(([key, icon]) => (
                    <option key={key} value={key}>
                      {icon}

                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottone per cambiare ordine in base al prezzo */}
            <div className="d-flex justify-content- around mb-2">
              <button
                className="btn btn-primary me-2"
                onClick={() => {
                  setSortBy("expence");
                  setSortOrderExpense((prev) =>
                    prev === "asc" ? "desc" : "asc"
                  );
                }}
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

              <button
                className="btn btn-primary"
                onClick={() => {
                  setSortBy("date");
                  setSortOrderDate((prev) => (prev === "asc" ? "desc" : "asc"));
                }}
              >
                Ordina per Data:{" "}
                {sortOrderDate === "asc" ? "Meno recente" : "Più recente"}
              </button>
            </div>
          </>
        )}

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
          {orderedPosts.map((post) => (
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
                    expence_euro={post.expence_euro}
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
