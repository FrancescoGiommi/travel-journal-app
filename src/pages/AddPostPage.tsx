import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { NewTravelPost } from "../../types";
import { supabase } from "../../supabase/supabaseClient";
import { useGlobalContext } from "../context/GlobalContext";

export default function AddPostPage() {
  const navigate = useNavigate();

  const { humorIcons, fetchPosts, tagStyles } = useGlobalContext();

  // Stati per ogni campo del form
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState("");
  const [date, setDate] = useState("");
  const [expenceEuro, setExpenseEuro] = useState<number | "">("");
  const [economicEffort, setEconomicEffort] = useState<number | "">("");
  const [physicalCommitment, setPhysicalCommitment] = useState<number | "">("");
  const [humor, setHumor] = useState("");
  const [positiveReflection, setPositiveReflection] = useState("");
  const [negativeReflection, setNegativeReflection] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Aggiunge un tag se non già presente e se sotto il limite di 3
  const handleTagSelect = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 3) {
      setTags((prev) => [...prev, tag]);
    }
  };

  // Rimuove un tag dalla lista
  const handleTagRemove = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  // Formatta il nome del file: minuscolo, spazi -> trattini, timestamp univoco
  const formatFileName = (name: string): string => {
    const ext = name.split(".").pop() ?? "";
    const base = name.slice(0, -(ext.length + 1));
    const slug = base.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return `${slug}-${Date.now()}.${ext}`;
  };

  // Gestisce la selezione del file immagine
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const formatted = formatFileName(file.name);
      setImageFile(file);
      setImageFileName(formatted);
    } else {
      setImageFile(null);
      setImageFileName("");
    }
  };

  // Funzione per ottenere l'URL pubblico dell'immagine dallo storage
  const getImageUrl = (fileName: string): string => {
    const { data } = supabase.storage
      .from("travel_images")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  // Funzione per salvare un nuovo post
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (
      !title ||
      !location ||
      !description ||
      !imageFile ||
      !date ||
      !expenceEuro ||
      !positiveReflection ||
      !negativeReflection ||
      tags.length === 0
    ) {
      return;
    }

    // Carica l'immagine su Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("travel_images")
      .upload(imageFileName, imageFile);

    if (uploadError) {
      console.error("Errore nel caricamento dell'immagine:", uploadError.message);
      return;
    }

    const newPost: NewTravelPost = {
      title,
      location,
      description,
      image: getImageUrl(imageFileName),
      date: date,
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

    // Aggiorna i post nella home
    await fetchPosts();

    // reset campi
    setTitle("");
    setLocation("");
    setDescription("");
    setImageFile(null);
    setImageFileName("");
    setDate("");
    setExpenseEuro("");
    setEconomicEffort("");
    setPhysicalCommitment("");
    setHumor("");
    setPositiveReflection("");
    setNegativeReflection("");
    setTags([]);

    // torno alla home
    navigate("/");
  };

  return (
    <>
      <div className="container pt-5">
        <div className="position-relative mb-5">
          <button
            className="btn btn-primary position-absolute"
            style={{ right: "calc(100% + 20px)", top: "4px", whiteSpace: "nowrap" }}
            onClick={() => navigate(-1)}
          >← Indietro</button>
          <h1 className="text-light mb-0">Aggiungi post</h1>
        </div>
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
                  id="title"
                  className={`form-control text-bg-dark mb-3 ${
                    formSubmitted && !title ? "is-invalid" : ""
                  }`}
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
                  id="location"
                  className={`form-control text-bg-dark mb-3 ${
                    formSubmitted && !location ? "is-invalid" : ""
                  }`}
                  required
                />
              </div>
            </div>

            <div className="d-flex flex-column w-100 mb-3">
              {/* Descrizione */}
              <span className="text-light mb-1">Inserisci una descrizione</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                className={`form-control text-bg-dark mb-3 ${
                  formSubmitted && !description ? "is-invalid" : ""
                }`}
                required
              ></textarea>
            </div>
            <div className="d-flex gap-3 mb-3">
              <div className="d-flex flex-column w-100">
                {/* Immagine */}
                <span className="text-light mb-1">Carica un'immagine</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image"
                  className={`form-control text-bg-dark mb-1 ${
                    formSubmitted && !imageFile ? "is-invalid" : ""
                  }`}
                  required
                />
                {imageFileName && (
                  <small className="text-secondary mb-2">Nome file: {imageFileName}</small>
                )}
              </div>
              <div className="d-flex flex-column w-100">
                {/* Data */}
                <span className="text-light mb-1">Inserisci la data</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  id="date"
                  className={`form-control text-bg-dark mb-3 ${
                    formSubmitted && !date ? "is-invalid" : ""
                  }`}
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
                id="expense_euro"
                className={`form-control text-bg-dark mb-3 ${
                  formSubmitted && !expenceEuro ? "is-invalid" : ""
                }`}
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
                  aria-label="Default select example"
                  value={economicEffort}
                  onChange={(e) => setEconomicEffort(Number(e.target.value))}
                  className={`form-control text-bg-dark mb-3 ${
                    formSubmitted && !economicEffort ? "is-invalid" : ""
                  }`}
                  required
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
                  aria-label="Default select example"
                  value={physicalCommitment}
                  onChange={(e) =>
                    setPhysicalCommitment(Number(e.target.value))
                  }
                  className={`form-control text-bg-dark mb-3 ${
                    formSubmitted && !physicalCommitment ? "is-invalid" : ""
                  }`}
                  required
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
                aria-label="Default select example"
                value={humor}
                onChange={(e) => setHumor(e.target.value)}
                className={`form-control text-bg-dark mb-3 ${
                  formSubmitted && !humor ? "is-invalid" : ""
                }`}
                required
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
                id="positive_reflection"
                value={positiveReflection}
                onChange={(e) => setPositiveReflection(e.target.value)}
                className={`form-control text-bg-dark mb-3 ${
                  formSubmitted && !positiveReflection ? "is-invalid" : ""
                }`}
                required
              ></textarea>
            </div>

            <div className="d-flex flex-column w-100 mb-3">
              {/* Riflessione negativa */}
              <span className="text-light mb-1">
                Inserisci una riflessione negativa
              </span>
              <textarea
                id="negative_reflection"
                value={negativeReflection}
                onChange={(e) => setNegativeReflection(e.target.value)}
                className={`form-control text-bg-dark mb-3 ${
                  formSubmitted && !negativeReflection ? "is-invalid" : ""
                }`}
                required
              ></textarea>
            </div>
            {/* Tags */}
            <div className="d-flex flex-column w-100 mb-3">
              <span className="text-light mb-1">
                Seleziona fino a 3 tags
              </span>
              <select
                value=""
                onChange={(e) => handleTagSelect(e.target.value)}
                className={`form-select text-bg-dark mb-2 ${
                  formSubmitted && tags.length === 0 ? "is-invalid" : ""
                }`}
                disabled={tags.length >= 3}
              >
                <option value="">Seleziona un tag</option>
                {Object.entries(tagStyles)
                  .filter(([key]) => !tags.includes(key))
                  .map(([key, { icon }]) => (
                    <option key={key} value={key}>
                      {icon} {key}
                    </option>
                  ))}
              </select>
              <div className="d-flex flex-wrap gap-2 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`badge bg-${tagStyles[tag]?.color ?? "secondary"} d-flex align-items-center gap-1`}
                    style={{ fontSize: "0.85rem" }}
                  >
                    {tagStyles[tag]?.icon} {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: "0.6rem" }}
                      onClick={() => handleTagRemove(tag)}
                    />
                  </span>
                ))}
              </div>
            </div>
          </form>
          <div className="d-flex gap-3">
            <button className="btn btn-success" onClick={handleSave}>
              Salva post
            </button>
            <Link to={"/"}>
              <button className="btn btn-secondary">Annulla</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
