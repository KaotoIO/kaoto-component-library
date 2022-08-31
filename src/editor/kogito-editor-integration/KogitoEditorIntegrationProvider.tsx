import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface IKogitoEditorIntegrationProvider {
  content: string;
  children: ReactNode;
  updateContent?: (content: string) => void;
  setUndoRedoCallbacks?: (undoCallback: () => void, redoCallback: () => void) => void;
}

export function KogitoEditorIntegrationProvider({
  content,
  updateContent,
  setUndoRedoCallbacks,
  children,
}: IKogitoEditorIntegrationProvider) {
  return (
    <KogitoEditorIntegrationContext.Provider value={{ content, updateContent, setUndoRedoCallbacks }}>
      {children}
    </KogitoEditorIntegrationContext.Provider>
  );
}

/**
 * Create context
 */
const KogitoEditorIntegrationContext = createContext<Omit<IKogitoEditorIntegrationProvider, "children">>({
  content: "",
});

/**
 * Convenience hook
 */
export function useKogitoEditorIntegration() {
  const context = useContext(KogitoEditorIntegrationContext);
  if (!context) {
    throw new Error("useKogitoEditorIntegration must be used within KogitoEditorIntegrationProvider!");
  }
  return context;
}
