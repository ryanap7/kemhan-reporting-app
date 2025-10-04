import { GlobalStyles } from "@/src/theme/common";
import { KeyboardAvoidingProps } from "@/src/types/component";
import React, { FC, memo } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const KeyboardAvoiding: FC<KeyboardAvoidingProps> = ({ children, style }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.wrapper}>
        <KeyboardAvoidingView
          contentContainerStyle={[styles.scrollContent, style]}
          style={styles.container}
          keyboardVerticalOffset={64}
        >
          {children}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(KeyboardAvoiding);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    ...GlobalStyles.flex,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
