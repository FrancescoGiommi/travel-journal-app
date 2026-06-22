import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { supabase } from "../../supabase/supabaseClient";
import DeletePostModal from "../components/DeletePostModal";
import type { PostImage } from "../../types";

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const location = useLocation();
  const backPath = (location.state as { from?: string } | null)?.from ?? "/";

  const {
    fetchPosts,
    posts,
    renderTags,
    humorIcons,
    expenceTagsColor,
    formatDate,
  } = useGlobalContext();

  const numericId = id ? parseInt(id, 10) : NaN;
  const locationDetails = posts.find((post) => post.id === numericId);

  // Gli hook devono essere chiamati incondizionatamente per preservare l'ordine tra i rendering
  const [localImages, setLocalImages] = useState<PostImage[] | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const fetchPostImages = async () => {
      try {
        if (!locationDetails) return;
        // Se abbiamo già immagini nella relazione non servono fetch aggiuntive
        if (
          locationDetails.post_images &&
          locationDetails.post_images.length > 0
        )
          return;

        const { data, error } = await supabase
          .from("post_images")
          .select("*")
          .eq("post_id", numericId)
          .order("position", { ascending: true });

        if (error) {
          console.error(
            "Errore nel recupero delle immagini del post:",
            error.message,
          );
          return;
        }

        setLocalImages(data ?? []);
      } catch (err) {
        console.error("Errore nel fetch delle immagini:", err);
      }
    };

    fetchPostImages();
  }, [numericId, locationDetails]);

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

  const postImages =
    locationDetails.post_images && locationDetails.post_images.length > 0
      ? locationDetails.post_images
      : [
          {
            id: locationDetails.id,
            created_at: locationDetails.date,
            post_id: locationDetails.id,
            image_url: locationDetails.image,
            position: 0,
            is_cover: true,
          },
        ];
  // Local fallback: se la relazione `post_images` non è presente nella fetch globale,
  // proviamo a recuperare le immagini direttamente dalla tabella `post_images`.

  const displayedImages = localImages ?? postImages;
  const carouselId = `postImagesCarousel-${locationDetails?.id ?? numericId}`;

  useEffect(() => {
    // Debug: log immagini e stato per capire cosa viene renderizzato
    console.debug("DetailsPage images", {
      postImagesLength: postImages.length,
      localImagesLength: localImages ? localImages.length : null,
      displayedImagesLength: displayedImages.length,
      displayedImages,
    });

    // Reset index quando cambiano le immagini
    setActiveIndex(0);

    return; // Removed autoplay logic
  }, [localImages, postImages, displayedImages.length, carouselId]);

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
            <button
              className="btn-app-secondary"
              onClick={() => navigate(backPath)}
            >
              Indietro
            </button>
            <button
              type="button"
              className="btn-app-warning"
              onClick={() =>
                navigate(`/editPost/${numericId}`, {
                  state: { from: backPath },
                })
              }
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
            <div id={carouselId} className="carousel slide detail-carousel">
              <div className="carousel-inner">
                {displayedImages.length > 0 && (
                  <div
                    key={displayedImages[activeIndex].id}
                    className={`carousel-item active`}
                  >
                    <img
                      className="img-detail"
                      src={displayedImages[activeIndex].image_url}
                      alt={`${locationDetails.title} - immagine ${activeIndex + 1}`}
                    />
                  </div>
                )}
              </div>

              {displayedImages.length > 1 && (
                <div className="thumbnails d-flex align-items-center">
                  {displayedImages.map((img, i) => (
                    <button
                      key={`thumb-${img.id}`}
                      type="button"
                      className={`thumb-btn ${i === activeIndex ? "active" : ""}`}
                      onClick={() => setActiveIndex(i)}
                    >
                      <img
                        src={img.image_url}
                        alt={`thumb-${i}`}
                        className={`thumb-img ${i === activeIndex ? "active" : ""}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
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
