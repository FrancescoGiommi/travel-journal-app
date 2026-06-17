import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Select from "react-select";
import type { NewTravelPost } from "../../types";
import { supabase } from "../../supabase/supabaseClient";
import { useGlobalContext } from "../context/GlobalContext";

export default function AddPostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { humorIcons, fetchPosts, tagStyles, posts } = useGlobalContext();

  const numericId = id ? parseInt(id, 10) : null;
  const isEditMode = numericId !== null && !Number.isNaN(numericId);
  const postToEdit = isEditMode
    ? posts.find((post) => post.id === numericId)
    : null;

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

  useEffect(() => {
    if (!isEditMode || !postToEdit) return;

    setTitle(postToEdit.title);
    setLocation(postToEdit.location);
    setDescription(postToEdit.description);
    setDate(postToEdit.date);
    setExpenseEuro(postToEdit.expence_euro ?? "");
    setEconomicEffort(postToEdit.economic_effort ?? "");
    setPhysicalCommitment(postToEdit.physical_commitment ?? "");
    setHumor(postToEdit.humor);
    setPositiveReflection(postToEdit.positive_reflection);
    setNegativeReflection(postToEdit.negative_reflection);
    setTags(postToEdit.tags);
  }, [isEditMode, postToEdit]);

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

  // Funzione per salvare un nuovo post o aggiornarne uno esistente
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (isEditMode && !postToEdit) {
      return;
    }

    if (
      !title ||
      !location ||
      !description ||
      (!isEditMode && !imageFile) ||
      !date ||
      expenceEuro === "" ||
      !economicEffort ||
      !physicalCommitment ||
      !humor ||
      !positiveReflection ||
      !negativeReflection ||
      tags.length === 0
    ) {
      return;
    }

    let imageUrl = postToEdit?.image ?? "";

    if (imageFile) {
      // Carica l'immagine su Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("travel_images")
        .upload(imageFileName, imageFile);

      if (uploadError) {
        console.error("Errore nel caricamento dell'immagine:", uploadError.message);
        return;
      }

      imageUrl = getImageUrl(imageFileName);
    }

    const postData: NewTravelPost = {
      title,
      location,
      description,
      image: imageUrl,
      date: date,
      expence_euro: Number(expenceEuro),
      economic_effort: Number(economicEffort),
      physical_commitment: Number(physicalCommitment),
      humor,
      positive_reflection: positiveReflection,
      negative_reflection: negativeReflection,
      tags,
    };

    const { error } = isEditMode
      ? await supabase
          .from("japan_travel_posts")
          .update(postData)
          .eq("id", numericId)
      : await supabase
          .from("japan_travel_posts")
          .insert([postData]);

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

    // torno al dettaglio se sto modificando, altrimenti alla home
    navigate(isEditMode && numericId ? `/details/${numericId}` : "/", {
      replace: isEditMode,
    });
  };

  if (isEditMode && !postToEdit) {
    return (
      <div className="container pt-5">
        <p className="text-light">
          {posts.length === 0
            ? "Caricamento post..."
            : "Post non trovato o dati non disponibili"}
        </p>
      </div>
    );
  }

  return (
    <main className="app-shell">
        <section className="app-hero">
          <button
            className="btn-app-secondary"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => navigate(-1)}
          >← Indietro</button>
          <h1 className="app-title">
            {isEditMode ? "Modifica post" : "Aggiungi post"}
          </h1>
        </section>
        <div className="glass-box">
          <form onSubmit={handleSave}>
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
                    formSubmitted && !isEditMode && !imageFile ? "is-invalid" : ""
                  }`}
                  required={!isEditMode}
                />
                {imageFileName && (
                  <small className="text-secondary mb-2">Nome file: {imageFileName}</small>
                )}
                {isEditMode && !imageFileName && postToEdit?.image && (
                  <small className="text-secondary mb-2">
                    Immagine attuale mantenuta se non ne carichi una nuova.
                  </small>
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
                onChange={(e) =>
                  setExpenseEuro(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                id="expense_euro"
                className={`form-control text-bg-dark mb-3 ${
                  formSubmitted && expenceEuro === "" ? "is-invalid" : ""
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
              <Select
                options={Object.entries(tagStyles)
                  .filter(([key]) => !tags.includes(key))
                  .map(([key, { icon }]) => ({ value: key, label: `${icon} ${key}` }))}
                onChange={(option) => { if (option) handleTagSelect(option.value); }}
                value={null}
                isDisabled={tags.length >= 3}
                placeholder="Cerca un tag..."
                classNamePrefix="rs"
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#212529",
                    borderColor: formSubmitted && tags.length === 0 ? "#dc3545" : state.isFocused ? "#86b7fe" : "#495057",
                    boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13,110,253,.25)" : "none",
                    color: "#fff",
                  }),
                  menu: (base) => ({ ...base, backgroundColor: "#212529", zIndex: 9999 }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#2c3034" : "#212529",
                    color: "#fff",
                    cursor: "pointer",
                  }),
                  singleValue: (base) => ({ ...base, color: "#fff" }),
                  input: (base) => ({ ...base, color: "#fff" }),
                  placeholder: (base) => ({ ...base, color: "#adb5bd" }),
                  indicatorSeparator: (base) => ({ ...base, backgroundColor: "#495057" }),
                  dropdownIndicator: (base) => ({ ...base, color: "#adb5bd" }),
                }}
              />
              <div className="d-flex flex-wrap gap-2 mt-2">
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
            <div className="form-actions">
              <button type="submit" className="btn-app-primary">
                {isEditMode ? "Aggiorna post" : "Salva post"}
              </button>
              <Link to={isEditMode && numericId ? `/details/${numericId}` : "/"}>
                <button type="button" className="btn-app-secondary">
                  Annulla
                </button>
              </Link>
            </div>
          </form>
        </div>
    </main>
  );
}
