import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { posts } = useGlobalContext();

  if (!id) {
    return <p>ID non valido</p>;
  }

  const numericId = parseInt(id, 10);
  const locationDetails = posts.find((post) => post.id === numericId);

  const tagStyles: Record<string, { color: string; icon: string }> = {
    "vita notturna": { color: "dark", icon: "🌃" },
    città: { color: "primary", icon: "🏙️" },
    natura: { color: "success", icon: "🌿" },
    templi: { color: "warning", icon: "⛩️" },
    spiritualità: { color: "info", icon: "🕊️" },
    cibo: { color: "danger", icon: "🍜" },
    divertimento: { color: "secondary", icon: "🎉" },
    animali: { color: "success", icon: "🐾" },
    relax: { color: "info", icon: "🛀" },
    shopping: { color: "secondary", icon: "🛍️" },
    cultura: { color: "secondary", icon: "📚" },
    musei: { color: "primary", icon: "🏛️" },
    mare: { color: "info", icon: "🌊" },
    tecnologia: { color: "dark", icon: "💻" },
    anime: { color: "warning", icon: "🎌" },
    tradizione: { color: "danger", icon: "🏮" },
    "parco a tema": { color: "success", icon: "🎢" },
    famiglia: { color: "primary", icon: "👨‍👩‍👧‍👦" },
    storia: { color: "secondary", icon: "📜" },
    arte: { color: "danger", icon: "🎨" },
    zen: { color: "success", icon: "🪷" },
    giardini: { color: "success", icon: "🌸" },
    kyoto: { color: "warning", icon: "🏯" },
    bambù: { color: "success", icon: "🎋" },
    riflessione: { color: "info", icon: "💭" },
    panorama: { color: "primary", icon: "🌅" },
    Osaka: { color: "danger", icon: "🌆" },
    architettura: { color: "secondary", icon: "🏗️" },
    tramonto: { color: "warning", icon: "🌇" },
    "esperienza urbana": { color: "dark", icon: "🚶‍♂️" },
    castelli: { color: "primary", icon: "🏰" },
  };

  function renderTags(tags: string[]) {
    return tags.map((tag) => {
      tag.trim().toLocaleLowerCase();
      const { color, icon } = tagStyles[tag] || {
        color: "secondary",
        icon: "🏷️",
      };
      return (
        <span key={tag} className={`badge text-bg-${color} me-2`}>
          {icon} {tag}
        </span>
      );
    });
  }

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
              <p>Costo: {locationDetails.expense_euro} €</p>
            </div>

            <div className="d-flex align-items-center gap-5">
              <p>Umore: {locationDetails.humor}</p>
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
