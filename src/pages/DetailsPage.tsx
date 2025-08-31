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
    return <p>Post non trovato o dati non disponibili</p>;
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
      <div className="container">
        <h1 className="mt-5 text-light mb-5">Pagina di dettaglio</h1>
        <div className="text-center">
          {/* Immagine */}
          <div>
            <img
              className="img-detail"
              src={locationDetails.image}
              alt={locationDetails.title}
            />
          </div>
          <div className="text-start glass-box mt-5 mb-5">
            {/* Titolo */}
            <div className="d-flex justify-content-between">
              <h2>{locationDetails.title}</h2>

              {/* Bottone per eliminare il post */}
              <button
                type="button"
                className="btn btn-danger rounded-3"
                data-bs-toggle="modal"
                data-bs-target="#deletePostModal"
              >
                Elimina
              </button>
            </div>
            {/* Luogo e Data */}
            <div className="d-flex align-items-center gap-5">
              <p>Luogo: {locationDetails.location}</p>
              <p>Data: {formatDate(locationDetails.date)}</p>
            </div>

            {/* Descrizione */}
            <p>Descrizione: {locationDetails.description}</p>

            {/* Riflessione positiva e negativa */}
            <div className="d-flex align-items-center gap-5">
              <p>Riflessione positiva: {locationDetails.positive_reflection}</p>
              <p>Riflessione negativa: {locationDetails.negative_reflection}</p>
            </div>

            {/* Effort economico e costo */}
            <div className="d-flex align-items-center gap-5">
              <p>Effort economico: {locationDetails.economic_effort}/5</p>
              <p>
                Costo: {expenceTagsColor(locationDetails.expence_euro ?? 0)}
              </p>
            </div>

            <div className="d-flex align-items-center gap-5">
              {/* Umore e impergno fisico */}
              <div className="d-flex">
                <p className="me-2">Umore:</p>
                <p className="badge text-bg-primary">
                  {humorIcons[locationDetails.humor]} {locationDetails.humor}
                </p>
              </div>
              <p>Impegno fisico: {locationDetails.physical_commitment}/5</p>
            </div>

            {/* tags */}
            <div className="d-flex align-items-center">
              <p>Tags: {renderTags(locationDetails.tags)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Moodale di conferma eliminazione */}
      <DeletePostModal
        postId={numericId}
        onConfirm={handleDelete}
        title={locationDetails.title}
      />
    </>
  );
}
