import React, { createContext, useContext } from "react";
import { useTravel } from "../customHooks/useTravel";
import type { TravelPost } from "../../types";

type GlobalContextProviderProps = {
  children: React.ReactNode;
};

type GlobalContextType = {
  posts: TravelPost[];
  renderTags: (tags: string[]) => React.ReactNode[];
  humorIcons: Record<string, string>;
  tagsList: Record<string, string>;
  expenceTagsColor: (expense: number) => React.ReactNode;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalContextProvider = ({
  children,
}: GlobalContextProviderProps) => {
  const { posts, renderTags, humorIcons, tagsList, expenceTagsColor } =
    useTravel();

  return (
    <GlobalContext.Provider
      value={{ posts, renderTags, humorIcons, tagsList, expenceTagsColor }}
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
