import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface PYQItem {
  question_year: string;
  id: number;
  pyq_content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  correct_option: string;
  explanation_content: string;
  user_resp: string | null;
}

export interface UserResponseMap {
  [question_id: string]: string; // { "101": "A" }
}

interface PYQContextType {
  pyqList: PYQItem[];
  setPYQList: (list: PYQItem[]) => void;
  userResponses: UserResponseMap;
  setUserResponses: React.Dispatch<React.SetStateAction<UserResponseMap>>;
}

const PYQContext = createContext<PYQContextType>({
  pyqList: [],
  setPYQList: () => {},
  userResponses: {},
  setUserResponses: () => {},
});

export const usePYQContext = () => useContext(PYQContext);

export const PYQProvider = ({ children }: { children: ReactNode }) => {
  const [pyqList, setPYQList] = useState<PYQItem[]>([]);
  const [userResponses, setUserResponses] = useState<UserResponseMap>({});

  useEffect(() => {
    const mapped: UserResponseMap = {};
    pyqList.forEach((q) => {
      if (q.user_resp !== null) mapped[q.id] = q.user_resp;
    });
    setUserResponses(mapped);
  }, [pyqList]);

  return (
    <PYQContext.Provider
      value={{ pyqList, setPYQList, userResponses, setUserResponses }}
    >
      {children}
    </PYQContext.Provider>
  );
};
