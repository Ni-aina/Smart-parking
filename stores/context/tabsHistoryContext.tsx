import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface TabsHistoryContext {
    pathname: string,
    setPathname: Dispatch<SetStateAction<string>>
}

const TabsHistoryContext = createContext<TabsHistoryContext|null>(null);

export const TabsHistoryContextProvider = ({ children }: { children: ReactNode }) => {
    const [pathname, setPathname] = useState<string>("/");

    return (
        <TabsHistoryContext.Provider
            value={{
                pathname,
                setPathname
            }}
        >
            {
                children
            }
        </TabsHistoryContext.Provider>
    )
}

export const useTabsHistoryContext = ()=> {
    const tabsHistoryContext = useContext(TabsHistoryContext);
    if (!tabsHistoryContext)  throw new Error("This context cannot be use outside of tabs context");
    const {
        pathname,
        setPathname
    } = tabsHistoryContext;

    return {
        pathname,
        setPathname
    }
}