import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NewTravelPost } from "../../types";
import { supabase } from "../../supabase/supabaseClient";
import { useGlobalContext } from "../context/GlobalContext";

export default function AddPostPage() {
  const navigate = useNavigate();

  const { humorIcons, fetchPosts } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [expenceEuro, setExpenseEuro] = useState<number | "">("");
  const [economicEffort, setEconomicEffort] = useState<number | "">("");
  const [physicalCommitment, setPhysicalCommitment] = useState<number | "">("");
  const [humor, setHumor] = useState("");
  const [positiveReflection, setPositiveReflection] = useState("");
  const [negativeReflection, setNegativeReflection] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Funzione che trasforma la stringa dei tags in array
  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const arr = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setTags(arr);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Funzione per ottenere l'URL dell'immagine
  const getImageUrl = (fileName: string): string => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const bucket = "travel_images";
    return `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;
  };

  const handleSave = async () => {
    const newPost: NewTravelPost = {
      title,
      location,
      description,
      image: getImageUrl(image),
      date: formatDate(date),
      expence_euro: Number(expenceEuro),
      economic_effort: Number(economicEffort),
      physical_commitment: Number(physicalCommitment),
      humor,
      positive_reflection: positiveReflection,
      negative_reflection: negativeReflection,
      tags,
    };

    const { error } = await supabase
      .from("japan_travel_posts")
      .insert([newPost]);

    if (error) {
      console.error("Errore nel salvataggio:", error.message);
      return;
    }

    console.log("Nuovo post salvato!");

    // Aggiorna i post nella home
    await fetchPosts();

    // reset campi
    setTitle("");
    setLocation("");
    setDescription("");
    setImage("");
    setDate("");
    setExpenseEuro("");
    setEconomicEffort("");
    setPhysicalCommitment("");
    setHumor("");
    setPositiveReflection("");
    setNegativeReflection("");
    setTagsInput("");
    setTags([]);

    // vai in home
    navigate("/");
  };

  return (
    <>
      <div className="container pt-5">
        <h1 className="mb-5 text-light">Aggiungi post</h1>
        <div className="glass-box">
          <form action="">
            <div className="d-flex gap-3">
              <div className="d-flex flex-column w-100">
                <span className="text-light mb-1">Inseirisci il titolo</span>
                {/* Titolo */}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control text-bg-dark mb-3"
                  id="title"
                  required
                />
              </div>
              <div className="d-flex flex-column w-100">
                {/* Luogo */}
                <span className="text-light mb-1">Inserisci il Luogo</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control text-bg-dark mb-3"
                  id="location"
                  placeholder="Inserisci il Luogo"
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-column w-100 mb-3">
              {/* Descrizione */}
              <span className="text-light mb-1">Inserisci una descrizione</span>
              <textarea
                className="form-control text-bg-dark"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                required
              ></textarea>
            </div>
            <div className="d-flex gap-3 mb-3">
              <div className="d-flex flex-column w-100">
                {/* Immagine */}
                <span className="text-light mb-1">
                  Inserisci il nome dell'immagine
                </span>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="form-control text-bg-dark"
                  id="image"
                  required
                />
              </div>
              <div className="d-flex flex-column w-100">
                {/* Data */}
                <span className="text-light mb-1">Inserisci la data</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control text-bg-dark"
                  id="date"
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-column w-100 mb-3">
              {/* Spesa in euro */}
              <span className="text-light mb-1">Inserisci l'importo speso</span>
              <input
                type="number"
                value={expenceEuro}
                onChange={(e) => setExpenseEuro(Number(e.target.value))}
                className="form-control text-bg-dark"
                id="expense_euro"
                required
              />
            </div>
            <div className="d-flex gap-3 mb-3">
              <div className="d-flex flex-column w-100">
                {/* Effort economico */}
                <span className="text-light mb-1">
                  Seleziona effort economico
                </span>

                <select
                  className="form-select text-bg-dark"
                  aria-label="Default select example"
                  value={economicEffort}
                  onChange={(e) => setEconomicEffort(Number(e.target.value))}
                >
                  <option value="">Seleziona un opzione</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="d-flex flex-column w-100">
                {/* Impegno fisico */}
                <span className="text-light mb-1">
                  Seleziona impegno fisico
                </span>

                <select
                  className="form-select text-bg-dark form-control"
                  aria-label="Default select example"
                  value={physicalCommitment}
                  onChange={(e) =>
                    setPhysicalCommitment(Number(e.target.value))
                  }
                >
                  <option value="">Seleziona un opzione</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <div className="d-flex flex-column w-100 mb-3">
              {/* Stato d'animo */}
              <span className="text-light mb-1">Seleziona stato d'animo</span>
              <select
                className="form-select text-bg-dark"
                aria-label="Default select example"
                value={humor}
                onChange={(e) => setHumor(e.target.value)}
              >
                <option value="">Seleziona un opzione</option>
                {Object.entries(humorIcons).map(([key, icon]) => (
                  <option key={key} value={key}>
                    {icon} {key}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex flex-column w-100 mb-3">
              {/* Riflessione positiva */}
              <span className="text-light mb-1">
                Inserisci una riflessione positiva
              </span>
              <textarea
                className="form-control text-bg-dark"
                id="positive_reflection"
                value={positiveReflection}
                onChange={(e) => setPositiveReflection(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="d-flex flex-column w-100 mb-3">
              {/* Riflessione negativa */}
              <span className="text-light mb-1">
                Inserisci una riflessione negativa
              </span>
              <textarea
                className="form-control text-bg-dark"
                id="negative_reflection"
                value={negativeReflection}
                onChange={(e) => setNegativeReflection(e.target.value)}
                required
              ></textarea>
            </div>
            {/* Tags */}
            <div className="d-flex flex-column w-100 mb-3">
              <span className="text-light mb-1">
                Inserisci fino a 3 tags separati da virgola
              </span>
              <input
                type="text"
                className="form-control text-bg-dark mb-2"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                required
              />
              <span className="text-light">
                Tags attuali: {tags.join(", ")}
              </span>
            </div>
          </form>
          <button className="btn btn-success" onClick={handleSave}>
            Salva post
          </button>
        </div>
      </div>
    </>
  );
}
