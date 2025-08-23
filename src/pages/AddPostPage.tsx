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
  const [expenseEuro, setExpenseEuro] = useState<number | "">("");
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
    const month = String(date.getMonth() + 1).padStart(2, "0"); // mesi da 0 a 11
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
      expense_euro: Number(expenseEuro),
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
              {/* Titolo */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control mb-3"
                id="title"
                placeholder="Inseirisci il titolo"
                required
              />

              {/* Luogo */}
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-control mb-3"
                id="location"
                placeholder="Inserisci il Luogo"
                required
              />
            </div>
            {/* Descrizione */}
            <div className="mb-3">
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                placeholder="Inserisci una descrizione"
                required
              ></textarea>
            </div>
            <div className="d-flex gap-3 mb-3">
              {/* Immagine */}
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="form-control"
                id="image"
                placeholder="Inserisci l'URL dell'immagine"
                required
              />

              {/* Data */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                id="date"
                placeholder="Inserisci la data"
                required
              />
            </div>
            {/* Spesa in euro */}
            <div className="mb-3">
              <input
                type="number"
                value={expenseEuro}
                onChange={(e) => setExpenseEuro(Number(e.target.value))}
                className="form-control"
                id="expense_euro"
                placeholder="Inserisci la spesa"
                required
              />
            </div>
            <div className="d-flex gap-3 mb-3">
              {/* Effort economico */}

              <select
                className="form-select"
                aria-label="Default select example"
                value={economicEffort}
                onChange={(e) => setEconomicEffort(Number(e.target.value))}
              >
                <option value="">Seleziona effort economico</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="3">4</option>
                <option value="3">5</option>
              </select>

              {/* Impegno fisico */}

              <select
                className="form-select form-control"
                aria-label="Default select example"
                value={physicalCommitment}
                onChange={(e) => setPhysicalCommitment(Number(e.target.value))}
              >
                <option value="">Seleziona impegno fisico</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="3">4</option>
                <option value="3">5</option>
              </select>
            </div>
            {/* Stato d'animo */}
            <div className="mb-3">
              <select
                className="form-select"
                aria-label="Default select example"
                value={humor}
                onChange={(e) => setHumor(e.target.value)}
              >
                <option value="">Seleziona stato d'animo</option>
                {Object.entries(humorIcons).map(([key, icon]) => (
                  <option key={key} value={key}>
                    {icon} {key}
                  </option>
                ))}
              </select>
            </div>
            {/* Riflessione positiva */}
            <div className="mb-3">
              <textarea
                className="form-control"
                id="positive_reflection"
                value={positiveReflection}
                onChange={(e) => setPositiveReflection(e.target.value)}
                placeholder="Inserisci una riflessione positiva"
                required
              ></textarea>
            </div>
            {/* Riflessione negativa */}
            <div className="mb-3">
              <textarea
                className="form-control"
                id="negative_reflection"
                value={negativeReflection}
                onChange={(e) => setNegativeReflection(e.target.value)}
                placeholder="Inserisci una riflessione negativa"
                required
              ></textarea>
            </div>
            {/* Tags */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Inserisci fino a 3 tags separati da virgola"
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
