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
  img_url?: string;
}

export interface RepeatedPYQList {
  subject_name: string;
  chapter_name: string;
  repeat_count: string;
  sub_topic: string;
  questions: PYQItem[];
}

export interface UserResponseMap {
  [question_id: string]: string; // { "101": "A" }
}

interface PYQContextType {
  pyqList: PYQItem[];
  setPYQList: (list: PYQItem[]) => void;
  repeatedPYQList: RepeatedPYQList[];
  setRepeatedPYQList: (list: RepeatedPYQList[]) => void;

  difficultyPYQList: PYQItem[];
  setDifficultyPYQList: (list: PYQItem[]) => void;

  userResponses: UserResponseMap;
  setUserResponses: React.Dispatch<React.SetStateAction<UserResponseMap>>;
}

const PYQContext = createContext<PYQContextType>({
  pyqList: [],
  setPYQList: () => { },
  repeatedPYQList: [],
  setRepeatedPYQList: () => { },

  difficultyPYQList: [],
  setDifficultyPYQList: () => { },

  userResponses: {},
  setUserResponses: () => { },
});

export const usePYQContext = () => useContext(PYQContext);

export const PYQProvider = ({ children }: { children: ReactNode }) => {
  const [pyqList, setPYQList] = useState<PYQItem[]>([]);
  const [repeatedPYQList, setRepeatedPYQList] = useState<RepeatedPYQList[]>([]);

  const [difficultyPYQList, setDifficultyPYQList] = useState<PYQItem[]>([]);
  const [userResponses, setUserResponses] = useState<UserResponseMap>({});

  // Sync responses from pyqList (active practicing list)
  useEffect(() => {
    if (pyqList.length === 0) return;
    setUserResponses(prev => {
      const next = { ...prev };
      let changed = false;
      pyqList.forEach(q => {
        // Handle both user_resp and user_response
        const resp = q.user_resp || (q as any).user_response;
        if (resp && next[q.id] !== resp) {
          next[q.id] = resp;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [pyqList]);

  // Sync responses from repeatedPYQList (clusters)
  useEffect(() => {
    if (repeatedPYQList.length === 0) return;
    setUserResponses(prev => {
      const next = { ...prev };
      let changed = false;
      repeatedPYQList.forEach(group => {
        group.questions.forEach(q => {
          // Handle both user_resp and user_response
          const resp = q.user_resp || (q as any).user_response;
          if (resp && next[q.id] !== resp) {
            next[q.id] = resp;
            changed = true;
          }
        });
      });
      return changed ? next : prev;
    });
  }, [repeatedPYQList]);

  return (
    <PYQContext.Provider
      value={{
        pyqList,
        setPYQList,
        repeatedPYQList,
        setRepeatedPYQList,

        difficultyPYQList,
        setDifficultyPYQList,

        userResponses,
        setUserResponses,
      }}
    >
      {children}
    </PYQContext.Provider>
  );
};
