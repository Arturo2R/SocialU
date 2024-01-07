import { createContext, useContext, useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";

interface DataStateContextInterface {
    data: Post[];
    // error: any;
    // loading: boolean;
    // fetchData: () => void;
}

export const dataStateContext = createContext<DataStateContextInterface | undefined>(
    undefined
  );

export const useData = () => {
    const context = useContext(dataStateContext);
    if (!context) throw new Error("There is no data provider");
    return context;
  };

export function DataStateProvider({ children }: { children: React.ReactNode }) {
    const {
        data,
        // error: dataError,
        // postsLoading,
        fetchData,
      } = useFirestore();
       const [fetched, setFetched] = useState<number>(0)

      useEffect(() => {
        // setIsLoading("loading");
        fetchData()//.then(() => setIsLoading("loaded"));
        let la = fetched +1
        setFetched(la)
        console.log("Fecheado a firestore", fetched);
        // return () => {
        // };
      }, []);

return (
    <dataStateContext.Provider
        value={{
        data,
        }}
    >
        {children}
    </dataStateContext.Provider>
    );
}