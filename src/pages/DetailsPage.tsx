import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { supabase } from "../../supabase/supabaseClient";
import DeletePostModal from "../components/DeletePostModal";
import type { PostImage, TravelPost } from "../../types";

const STORAGE_BUCKET = "travel_images";

function getStoragePathFromPublicUrl(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    const storagePathMatch = url.pathname.match(
      new RegExp(
        `/storage/v1/(?:object/(?:public|sign)|render/image/public)/${STORAGE_BUCKET}/(.+)$`,
      ),
    );

    if (!storagePathMatch?.[1]) return null;

    return decodeURIComponent(storagePathMatch[1]);
  } catch {
    return null;
  }
}

function closeBootstrapModal(modalId: string) {
  const modalElement = document.getElementById(modalId);

  modalElement?.classList.remove("show");
  modalElement?.setAttribute("aria-hidden", "true");
  modalElement?.removeAttribute("aria-modal");
  modalElement?.removeAttribute("role");

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.remove();
  });

  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("padding-right");
}

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

  const [singlePost, setSinglePost] = useState<TravelPost | null>(null);
  const [localImages, setLocalImages] = useState<PostImage[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingSinglePost, setLoadingSinglePost] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const locationDetails = useMemo(
    () => posts.find((post) => post.id === numericId) ?? null,
    [posts, numericId],
  );

  const effectiveDetails = locationDetails ?? singlePost ?? null;

  useEffect(() => {
    const fetchSinglePost = async () => {
      if (!Number.isFinite(numericId)) return;
      if (locationDetails) return;

      setLoadingSinglePost(true);

      const { data, error } = await supabase
        .from("japan_travel_posts")
        .select(
          `
          *,
          post_images (
            id,
            image_url,
            position,
            is_cover
          )
        `,
        )
        .eq("id", numericId)
        .maybeSingle();

      if (error) {
        console.error("Errore recupero singolo post:", error.message);
        setLoadingSinglePost(false);
        return;
      }

      if (data) {
        setSinglePost({
          ...data,
          post_images: [...(data.post_images ?? [])].sort(
            (a, b) => a.position - b.position,
          ),
        } as TravelPost);
      }

      setLoadingSinglePost(false);
    };

    fetchSinglePost();
  }, [numericId, locationDetails]);

  useEffect(() => {
    const fetchPostImages = async () => {
      if (!Number.isFinite(numericId)) return;
      if (!effectiveDetails) return;

      if (
        effectiveDetails.post_images &&
        effectiveDetails.post_images.length > 0
      ) {
        setLocalImages(null);
        return;
      }

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

      setLocalImages((data ?? []) as PostImage[]);
    };

    fetchPostImages();
  }, [numericId, effectiveDetails]);

  const postImages: PostImage[] = effectiveDetails
    ? effectiveDetails.post_images && effectiveDetails.post_images.length > 0
      ? [...effectiveDetails.post_images].sort(
          (a, b) => a.position - b.position,
        )
      : effectiveDetails.image
        ? [
            {
              id: effectiveDetails.id,
              created_at: effectiveDetails.date,
              post_id: effectiveDetails.id,
              image_url: effectiveDetails.image,
              position: 0,
              is_cover: true,
            },
          ]
        : []
    : [];

  const displayedImages = localImages ?? postImages;
  const carouselId = `postImagesCarousel-${effectiveDetails?.id ?? numericId}`;

  useEffect(() => {
    setActiveIndex(0);
  }, [carouselId, displayedImages.length]);

  const handleDelete = async () => {
    if (!Number.isFinite(numericId) || !effectiveDetails || isDeleting) return;

    setDeleteError("");
    setIsDeleting(true);

    try {
      const { data: storedImages, error: storedImagesError } = await supabase
        .from("post_images")
        .select("image_url")
        .eq("post_id", numericId);

      if (storedImagesError) {
        throw new Error(
          `Impossibile leggere le immagini collegate al post: ${storedImagesError.message}`,
        );
      }

      const imageUrls = [
        effectiveDetails.image,
        ...displayedImages.map((image) => image.image_url),
        ...(storedImages ?? []).map((image) => image.image_url),
      ].filter(Boolean);

      const storagePaths = Array.from(
        new Set(
          imageUrls
            .map((imageUrl) => getStoragePathFromPublicUrl(imageUrl))
            .filter((path): path is string => Boolean(path)),
        ),
      );
      const hasSupabaseStorageImages = imageUrls.some((imageUrl) =>
        imageUrl.includes(`/storage/v1/object/`),
      );

      if (hasSupabaseStorageImages && storagePaths.length === 0) {
        throw new Error(
          "Non sono riuscito a ricavare il percorso delle immagini nello storage. Il post non e stato eliminato.",
        );
      }

      if (storagePaths.length > 0) {
        const { data: removedFiles, error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove(storagePaths);

        if (storageError) {
          throw new Error(
            `Impossibile eliminare le immagini dallo storage: ${storageError.message}. Il post non e stato eliminato.`,
          );
        }

        if (!removedFiles || removedFiles.length === 0) {
          throw new Error(
            `Supabase non ha confermato la rimozione dei file (${storagePaths.join(", ")}). Il post non e stato eliminato.`,
          );
        }
      }

      const { data: deletedPosts, error: postDeleteError } = await supabase
        .from("japan_travel_posts")
        .delete()
        .eq("id", numericId)
        .select("id");

      if (postDeleteError) {
        throw new Error(
          `Le immagini sono state eliminate, ma il post no: ${postDeleteError.message}`,
        );
      }

      if (!deletedPosts || deletedPosts.length === 0) {
        throw new Error(
          "Le immagini sono state eliminate, ma nessun post e stato rimosso dal database.",
        );
      }

      const { error: imagesDeleteError } = await supabase
        .from("post_images")
        .delete()
        .eq("post_id", numericId);

      if (imagesDeleteError && imagesDeleteError.code !== "42501") {
        throw new Error(
          `Il post e stato eliminato, ma non i riferimenti alle immagini: ${imagesDeleteError.message}`,
        );
      }

      await fetchPosts();
      closeBootstrapModal("deletePostModal");
      navigate("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Errore imprevisto durante l'eliminazione.";

      console.error(message);
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingSinglePost && !effectiveDetails) {
    return (
      <main className="app-shell">
        <div className="app-panel empty-state">
          <h2>Caricamento post...</h2>
          <p>I dati sono in fase di caricamento, attendere prego.</p>
        </div>
      </main>
    );
  }

  if (!effectiveDetails) {
    return (
      <main className="app-shell">
        <div className="app-panel empty-state">
          <h2>Post non trovato</h2>
          <p>I dati potrebbero essere ancora in caricamento.</p>
        </div>
      </main>
    );
  }

  const postSource = effectiveDetails;

  return (
    <>
      <main className="app-shell">
        <section className="app-hero">
          <div>
            <p className="app-kicker">Dettaglio viaggio</p>
            <h1 className="app-title">{postSource.title}</h1>
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

        {deleteError && (
          <div className="app-alert app-alert-danger" role="alert">
            {deleteError}
          </div>
        )}

        <section className="detail-layout">
          <div>
            <div id={carouselId} className="carousel slide detail-carousel">
              <div className="carousel-inner">
                {displayedImages.length > 0 && (
                  <div
                    className="carousel-item active"
                    key={displayedImages[activeIndex].id}
                  >
                    <img
                      className="img-detail"
                      src={displayedImages[activeIndex].image_url}
                      alt={`${postSource.title} - immagine ${activeIndex + 1}`}
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
                {postSource.location} - {formatDate(postSource.date)}
              </p>
            </div>

            <div className="detail-section">
              <h3>Descrizione</h3>
              <p>{postSource.description}</p>
            </div>

            <div className="detail-section">
              <h3>Riflessioni</h3>
              <p>
                <strong>Momento positivo:</strong>{" "}
                {postSource.positive_reflection}
              </p>
              <p>
                <strong>Momento negativo:</strong>{" "}
                {postSource.negative_reflection}
              </p>
            </div>

            <div className="detail-section">
              <h3>Umore</h3>
              <p>
                {humorIcons[postSource.humor]} {postSource.humor}
              </p>
            </div>

            <div className="detail-section">
              <h3>Impegno e costo</h3>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="meta-pill">
                  Effort economico: {postSource.economic_effort}/5
                </span>
                <span className="meta-pill">
                  Impegno fisico: {postSource.physical_commitment}/5
                </span>
                <span className="meta-pill price-meta-pill">
                  Costo:
                  {expenceTagsColor(postSource.expence_euro ?? 0)}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Tag</h3>
              <div>{renderTags(postSource.tags)}</div>
            </div>
          </article>
        </section>
      </main>

      <DeletePostModal
        postId={numericId}
        onConfirm={handleDelete}
        title={postSource.title}
        isDeleting={isDeleting}
        errorMessage={deleteError}
      />
    </>
  );
}




