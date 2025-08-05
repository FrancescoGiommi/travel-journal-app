export type TravelPost = {
  id: number;
  titolo: string;
  data: string;
  luogo: string;
  latitudine?: number;
  longitudine?: number;
  media_url?: string;
  descrizione?: string;
  umore?: string;
  riflessione_positiva?: string;
  riflessione_negativa?: string;
  impegno_fisico?: number;
  effort_economico?: number;
  spesa_euro?: number;
  tags?: string[];
};
