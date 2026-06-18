import { useState, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

import PostCard from "../components/PostCard";

// Funzione di debounce
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
  const { posts, renderTags, humorIcons, expenceTagsColor, tagStyles } =
    useGlobalContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  // Stati per la ricerca e i filtri
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
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const postsPerPage = 9;

  const goToPage = (page: number) => {
    const nextPage = Math.max(1, page);

    setCurrentPage(nextPage);
    setSearchParams(nextPage === 1 ? {} : { page: String(nextPage) });
  };

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

  // Funzione per il debounce della ricerca
  const debouncedSearch = useCallback(
    debounce<string>((value) => setSearchBar(value), 300),
    []
  );

  // Funzione per aggiungere un tag
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
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

  // Calcolo degli indici per slice
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = orderedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Quante pagine totali
  const totalPages = Math.ceil(orderedPosts.length / postsPerPage);
  const activeFilterCount =
    (searchText.trim() ? 1 : 0) +
    (filterHumor ? 1 : 0) +
    selectedTags.length;

  const resetFilters = () => {
    setSearchBar("");
    setSearchText("");
    setFilterHumor("");
    setSelectedTags([]);
    setSortBy(null);
    goToPage(1);
  };

  return (
    <main className="app-shell">
      <section className="app-hero">
        <div>
          <p className="app-kicker">Diario di viaggio</p>
          <h1 className="app-title">Viaggio in Giappone</h1>
          <p className="app-subtitle">
            Luoghi, stati d'animo, spese e riflessioni raccolti in un diario
            visivo da esplorare con filtri rapidi.
          </p>
        </div>
        <div className="app-actions">
          <button
            className="btn-app-secondary"
            onClick={() => setShowSearchMenu(!showSearchMenu)}
          >
            {showSearchMenu ? "Nascondi filtri" : "Filtra e ordina"}
          </button>
          <Link to={"/addPost"}>
            <button className="btn-app-primary">Aggiungi post</button>
          </Link>
        </div>
      </section>

      {showSearchMenu && (
        <section className="app-panel toolbar-panel">
          <div className="toolbar-grid">
            <div className="d-flex flex-column">
              <span className="filter-label mb-2">Cerca per titolo</span>
              <input
                className="form-control text-bg-dark"
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  debouncedSearch(e.target.value);
                  goToPage(1);
                }}
                placeholder="Es. Kyoto, tempio, Osaka..."
              />
            </div>

            <div className="d-flex flex-column">
              <span className="filter-label mb-2">Stato d'animo</span>
              <select
                value={filterHumor}
                onChange={(e) => {
                  setFilterHumor(e.target.value);
                  goToPage(1);
                }}
                className="form-select text-bg-dark"
                aria-label="Filtra per stato d'animo"
              >
                <option value="">Tutti gli stati d'animo</option>
                {Object.entries(humorIcons).map(([key, icon]) => (
                  <option key={key} value={key}>
                    {icon} {key}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex flex-column">
            <span className="filter-label mb-2">Tag</span>
            <select
              value=""
              onChange={(e) => {
                addTag(e.target.value);
                goToPage(1);
              }}
              className="form-select text-bg-dark"
              aria-label="Filtra per tag"
            >
              <option value="">Aggiungi un tag</option>
              {Object.entries(tagStyles).map(([key, { icon }]) => (
                <option key={key} value={key}>
                  {icon} {key}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn-app-secondary"
              onClick={() => {
                setSortBy("expence");
                setSortOrderExpense((prev) =>
                  prev === "asc" ? "desc" : "asc"
                );
              }}
            >
              Prezzo: {sortOrderExpense === "asc" ? "crescente" : "decrescente"}
            </button>

            <button
              className="btn-app-secondary"
              onClick={() => {
                setSortBy("date");
                setSortOrderDate((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Data: {sortOrderDate === "asc" ? "meno recente" : "piu recente"}
            </button>

            {activeFilterCount > 0 && (
              <button className="btn-app-secondary" onClick={resetFilters}>
                Reimposta filtri
              </button>
            )}
          </div>
        </section>
      )}

      {(searchText || filterHumor || selectedTags.length > 0) && (
        <div className="active-filter-row">
          {searchText && (
            <button
              className="filter-chip"
              onClick={() => {
                setSearchText("");
                setSearchBar("");
              }}
            >
              Titolo: {searchText} x
            </button>
          )}
          {filterHumor && (
            <button className="filter-chip" onClick={() => setFilterHumor("")}>
              Umore: {filterHumor} x
            </button>
          )}
          {selectedTags.map((tag) => {
            const style = tagStyles[tag];
            return (
              <button
                key={tag}
                className="filter-chip"
                onClick={() => removeTag(tag)}
              >
                {style.icon} {tag} x
              </button>
            );
          })}
        </div>
      )}

      <section className="row justify-content-center">
        {currentPosts.length === 0 ? (
          <div className="col-12">
            <div className="app-panel empty-state">
              <h2>Nessun luogo trovato</h2>
              <p>
                Prova a rimuovere qualche filtro o aggiungi un nuovo ricordo al
                diario.
              </p>
            </div>
          </div>
        ) : (
          currentPosts.map((post) => (
            <div
              key={post.id}
              className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
            >
              <div className="post-card-shell">
                <Link
                  to={`/details/${post.id}`}
                  state={{ from: currentPage === 1 ? "/" : `/?page=${currentPage}` }}
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
          ))
        )}
      </section>

      {/* Paginazione */}
      {totalPages > 1 && (
        <nav
          aria-label="Page navigation"
          className="d-flex justify-content-center"
        >
          <ul className="pagination">
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
            >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage - 1)}
                >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
                <button
                  className="page-link"
                  onClick={() => goToPage(currentPage + 1)}
                >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </main>
  );
}
