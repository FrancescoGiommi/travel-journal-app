import React, { createContext, useContext } from "react";
import { useTravel } from "../customHooks/useTravel";
import type { TravelPost } from "../../types";

type GlobalContextProviderProps = {
  children: React.ReactNode;
};

type GlobalContextType = {
  fetchPosts: () => Promise<TravelPost[] | null>;
  posts: TravelPost[];
  renderTags: (tags: string[]) => React.ReactNode[];
  humorIcons: Record<string, string>;
  expenceTagsColor: (expence: number | null) => React.ReactNode;
  formatDate: (datestring: string) => string;
  tagStyles: Record<string, { color: string; icon: string }>;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider = ({
  children,
}: GlobalContextProviderProps) => {
  const {
    posts,
    renderTags,
    humorIcons,
    expenceTagsColor,
    fetchPosts,
    formatDate,
    tagStyles,
  } = useTravel();

  return (
    <GlobalContext.Provider
      value={{
        posts,
        renderTags,
        humorIcons,
        expenceTagsColor,
        fetchPosts,
        formatDate,
        tagStyles,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext deve essere usato all'interno di GlobalContextProvider"
    );
  }
  return context;
};
