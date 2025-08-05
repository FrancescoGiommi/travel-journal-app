import React, { createContext, useContext } from "react";
import { useTravel } from "../customHooks/useTravel";
import type { TravelPost } from "../../types";

const GlobalContext = createContext<GlobalContextType | null>(null);

type GlobalContextProviderProps = {
  children: React.ReactNode;
};

type GlobalContextType = {
  posts: TravelPost[];
};

export const GlobalContextProvider = ({
  children,
}: GlobalContextProviderProps) => {
  const { posts } = useTravel();

  return (
    <GlobalContext.Provider value={{ posts }}>
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
