import { withTheme } from "@/src/hoc/withTheme";
import { BORDER_RADIUS } from "@/src/theme/borderRadius";
import { SPACING } from "@/src/theme/spacing";
import { BottomSheetProps, BottomSheetState } from "@/src/types/component";
import { BlurView } from "expo-blur";
import React, { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  Platform,
  Pressable,
  KeyboardEvent as RNKeyboardEvent,
  StyleSheet,
  View,
} from "react-native";
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import { PanGestureHandlerEventPayload } from "react-native-screens";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class BottomSheet extends PureComponent<BottomSheetProps, BottomSheetState> {
  translateY = new Animated.Value(SCREEN_HEIGHT);
  blurOpacity = new Animated.Value(0);
  private currentTranslateY: number = 0;
  private keyboardHeight: number = 0;
  private keyboardShow?: any;
  private keyboardHide?: any;

  constructor(props: BottomSheetProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.keyboardShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      this.onKeyboardShow
    );
    this.keyboardHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      this.onKeyboardHide
    );
  }

  componentWillUnmount() {
    this.keyboardShow?.remove();
    this.keyboardHide?.remove();
  }

  onKeyboardShow = (e: RNKeyboardEvent) => {
    const { keyboardBehavior } = this.props;
    if (keyboardBehavior === "aboveKeyboard") {
      this.keyboardHeight = e.endCoordinates.height;
      Animated.timing(this.translateY, {
        toValue: -this.keyboardHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  onKeyboardHide = () => {
    const { keyboardBehavior } = this.props;
    if (keyboardBehavior === "aboveKeyboard") {
      this.keyboardHeight = 0;
      Animated.timing(this.translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  show = () => {
    this.setState({ visible: true }, () => {
      this.translateY.setValue(SCREEN_HEIGHT);
      this.blurOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(this.translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(this.blurOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  hide = () => {
    Animated.parallel([
      Animated.timing(this.translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(this.blurOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ visible: false });
    });
  };

  animateTo = (toValue: number) => {
    Animated.timing(this.translateY, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const translationY = event.nativeEvent.translationY;

    if (translationY > 0) {
      this.currentTranslateY = translationY;
      this.translateY.setValue(translationY);
    }
  };

  onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    const { translationY } = event.nativeEvent;

    if (translationY > 100) {
      this.hide();
    } else {
      this.animateTo(0);
    }

    this.currentTranslateY = 0;
  };

  render() {
    const { children, style, type = "content", onClose } = this.props;
    const { theme } = this.props;
    const { visible } = this.state;

    if (!visible) return null;

    return (
      <View style={styles.wrapper} pointerEvents="box-none">
        {/* BLUR BACKGROUND */}
        <Animated.View
          style={[styles.blurPressable, { opacity: this.blurOpacity }]}
        >
          <Pressable
            style={styles.blurPressable}
            onPress={onClose ?? this.hide}
          >
            <BlurView
              intensity={70}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={styles.blur}
            />
          </Pressable>
        </Animated.View>

        {/* SHEET */}
        <Animated.View
          style={[
            styles.sheet,
            type === "full" && styles.fullSheet,
            style,
            {
              backgroundColor: theme?.colors.background,
              transform: [{ translateY: this.translateY }],
            },
          ]}
        >
          <PanGestureHandler
            onGestureEvent={this.onGestureEvent}
            onHandlerStateChange={this.onHandlerStateChange}
          >
            <View style={styles.hintWrapper}>
              <View
                style={[styles.hint, { backgroundColor: theme?.colors.border }]}
              />
            </View>
          </PanGestureHandler>

          <View style={[styles.content, type === "full" && styles.fullContent]}>
            {children}
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default withTheme(BottomSheet);

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  blurPressable: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  hintWrapper: {
    height: 20,
    width: "100%",
    paddingTop: SPACING.sm,
    alignItems: "center",
    zIndex: 3,
  },
  hint: {
    height: 4,
    width: 56,
    borderRadius: BORDER_RADIUS.lg,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    zIndex: 4,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  fullContent: {
    paddingBottom: SPACING.xl + 100,
  },
  fullSheet: {
    top: 64,
    bottom: 0,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
  },
});
