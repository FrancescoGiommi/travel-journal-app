import { useParams } from "react-router-dom";

export default function DetailsPage() {
  const { id } = useParams();
  return (
    <>
      <div className="container">
        <h1>Pagina di dettaglio</h1>
      </div>
    </>
  );
}
