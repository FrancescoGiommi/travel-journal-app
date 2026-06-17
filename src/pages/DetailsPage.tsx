import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { supabase } from "../../supabase/supabaseClient";
import DeletePostModal from "../components/DeletePostModal";

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const {
    fetchPosts,
    posts,
    renderTags,
    humorIcons,
    expenceTagsColor,
    formatDate,
  } = useGlobalContext();

  if (!id) {
    return <p>Post non trovato</p>;
  }

  const numericId = parseInt(id, 10);
  const locationDetails = posts.find((post) => post.id === numericId);

  if (!locationDetails) {
    return (
      <main className="app-shell">
        <div className="app-panel empty-state">
          <h2>Post non trovato</h2>
          <p>I dati potrebbero essere ancora in caricamento.</p>
        </div>
      </main>
    );
  }

  // Funzione per eliminare un post
  const handleDelete = async () => {
    const { error } = await supabase
      .from("japan_travel_posts")
      .delete()
      .eq("id", numericId);

    if (error) {
      console.error("Errore durante l'eliminazione:", error.message);
      return;
    }

    // rifaccio la query per ottenere la lista aggiornata
    await fetchPosts();

    navigate("/");
  };

  return (
    <>
      <main className="app-shell">
        <section className="app-hero">
          <div>
            <p className="app-kicker">Dettaglio viaggio</p>
            <h1 className="app-title">{locationDetails.title}</h1>
          </div>

          <div className="app-actions">
            <button className="btn-app-secondary" onClick={() => navigate("/")}>
              Indietro
            </button>
            <button
              type="button"
              className="btn-app-warning"
              onClick={() => navigate(`/editPost/${numericId}`)}
            >
              Modifica
            </button>
            <button
              type="button"
              className="btn-app-danger"
              data-bs-toggle="modal"
              data-bs-target="#deletePostModal"
            >
              Elimina
            </button>
          </div>
        </section>

        <section className="detail-layout">
          <div>
            <img
              className="img-detail"
              src={locationDetails.image}
              alt={locationDetails.title}
            />
          </div>

          <article className="app-panel">
            <div className="detail-section mt-0 pt-0 border-0">
              <h3>Luogo & Data</h3>
              <p>
                {locationDetails.location} - {formatDate(locationDetails.date)}
              </p>
            </div>

            <div className="detail-section">
              <h3>Descrizione</h3>
              <p>{locationDetails.description}</p>
            </div>

            <div className="detail-section">
              <h3>Riflessioni</h3>
              <p>
                <strong>Momento positivo:</strong>{" "}
                {locationDetails.positive_reflection}
              </p>
              <p>
                <strong>Da ricordare:</strong>{" "}
                {locationDetails.negative_reflection}
              </p>
            </div>

            <div className="detail-section">
              <h3>Umore</h3>
              <p>
                {humorIcons[locationDetails.humor]} {locationDetails.humor}
              </p>
            </div>

            <div className="detail-section">
              <h3>Impegno e costo</h3>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="meta-pill">
                  Effort economico: {locationDetails.economic_effort}/5
                </span>
                <span className="meta-pill">
                  Impegno fisico: {locationDetails.physical_commitment}/5
                </span>
                <span className="meta-pill price-meta-pill">
                  Costo:
                  {expenceTagsColor(locationDetails.expence_euro ?? 0)}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Tag</h3>
              <div>{renderTags(locationDetails.tags)}</div>
            </div>
          </article>
        </section>
      </main>

      {/* Modale di conferma eliminazione */}
      <DeletePostModal
        postId={numericId}
        onConfirm={handleDelete}
        title={locationDetails.title}
      />
    </>
  );
}
