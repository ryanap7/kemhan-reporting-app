import "@/src/api";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { BottomSheetProvider } from "@/src/contexts/BottomSheetContext";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { GlobalStyles } from "@/src/theme/common";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  const [isLoaded] = useFonts({
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
  });

  if (!isLoaded) return null;

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={GlobalStyles.flex}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <AuthProvider>
              <BottomSheetProvider>
                <Slot />
              </BottomSheetProvider>
            </AuthProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default RootLayout;
