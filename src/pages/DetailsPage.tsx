import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { posts, renderTags, humorIcons, expenceTagsColor } =
    useGlobalContext();

  if (!id) {
    return <p>ID non valido</p>;
  }

  const numericId = parseInt(id, 10);
  const locationDetails = posts.find((post) => post.id === numericId);

  if (!locationDetails) {
    return <p>Post non trovato o dati non disponibili</p>;
  }

  return (
    <>
      <div className="container">
        <h1>Pagina di dettaglio</h1>
        <div className="text-center">
          <div>
            <img
              className="img-detail"
              src={locationDetails.image}
              alt={locationDetails.title}
            />
          </div>
          <div className="text-start form-control mt-5">
            <h2>{locationDetails.title}</h2>
            <div className="d-flex align-items-center gap-5">
              <p>Luogo: {locationDetails.location}</p>

              <p>Data: {locationDetails.date}</p>
            </div>

            <p>Descrizione: {locationDetails.description}</p>

            <div className="d-flex align-items-center gap-5">
              <p>Riflessione positiva: {locationDetails.positive_reflection}</p>
              <p>Riflessione negativa: {locationDetails.negative_reflection}</p>
            </div>

            <div className="d-flex align-items-center gap-5">
              <p>Effort economico: {locationDetails.economic_effort}/5</p>
              <p>Costo: {expenceTagsColor(locationDetails.expense_euro)}</p>
            </div>

            <div className="d-flex align-items-center gap-5">
              <div className="d-flex">
                <p className="me-2">Umore:</p>
                <p className="badge text-bg-primary">
                  {humorIcons[locationDetails.humor]} {locationDetails.humor}
                </p>
              </div>
              <p>Impegno fisico: {locationDetails.physical_commitment}/5</p>
            </div>
            <div className="d-flex align-items-center">
              <p>Tags: {renderTags(locationDetails.tags)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
