import React, { createContext, ReactNode, useContext, useState } from "react";

export interface PYQItem {
  id: number;
  pyq_content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct_option: string;
  explanation_content: string;
}

interface PYQContextType {
  pyqList: PYQItem[];
  setPYQList: (list: PYQItem[]) => void;
}

const PYQContext = createContext<PYQContextType>({
  pyqList: [],
  setPYQList: () => {},
});

export const usePYQContext = () => useContext(PYQContext);

export const PYQProvider = ({ children }: { children: ReactNode }) => {
  const [pyqList, setPYQList] = useState<PYQItem[]>([]);

  return (
    <PYQContext.Provider value={{ pyqList, setPYQList }}>
      {children}
    </PYQContext.Provider>
  );
};
