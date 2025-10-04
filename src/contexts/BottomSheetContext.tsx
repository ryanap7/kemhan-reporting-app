import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { BottomSheet } from "../components/feedback";

type BottomSheetType = "full" | "content";
type KeyboardBehavior = "fixed" | "aboveKeyboard";

type BottomSheetContextType = {
  show: (
    content: React.ReactNode,
    type?: BottomSheetType,
    keyboardBehavior?: KeyboardBehavior
  ) => void;
  hide: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const BottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<InstanceType<typeof BottomSheet>>(null);

  const [type, setType] = useState<BottomSheetType>("content");
  const [keyboardBehavior, setKeyboardBehavior] =
    useState<KeyboardBehavior>("fixed");
  const [content, setContent] = useState<React.ReactNode>(null);

  const show = useCallback(
    (
      node: React.ReactNode,
      sheetType: BottomSheetType = "content",
      kbBehavior: KeyboardBehavior = "fixed"
    ) => {
      setContent(node);
      setType(sheetType);
      setKeyboardBehavior(kbBehavior);
      bottomSheetRef.current?.show();
    },
    []
  );

  const hide = useCallback(() => {
    bottomSheetRef.current?.hide();
  }, []);

  return (
    <BottomSheetContext.Provider value={{ show, hide }}>
      {children}
      <BottomSheet
        ref={bottomSheetRef}
        type={type}
        keyboardBehavior={keyboardBehavior}
      >
        {content}
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used inside BottomSheetProvider");
  }
  return context;
};
