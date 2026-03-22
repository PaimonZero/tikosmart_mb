import React, { useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const { width } = Dimensions.get("window");

export default function CustomSplash({
  isAppReady,
  onAnimationFinish,
}: {
  isAppReady: boolean;
  onAnimationFinish: () => void;
}) {
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  const [isAnimationFinished, setIsAnimationFinished] = React.useState(false);

  useEffect(() => {
    // 1. Logo pop up
    logoScale.value = withTiming(1, { duration: 800 });
    logoOpacity.value = withTiming(1, { duration: 600 });

    // 2. Text slide up and fade in
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: 600 }, () => {
        scheduleOnRN(setIsAnimationFinished, true);
      })
    );
  }, []);

  // 3. Exit animation triggers when data is ready AND entrance is done
  useEffect(() => {
    if (isAnimationFinished && isAppReady) {
      containerOpacity.value = withDelay(800, withTiming(0, { duration: 500 }, () => {
        scheduleOnRN(onAnimationFinish);
      }));
    }
  }, [isAnimationFinished, isAppReady]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <Animated.View
      className="absolute inset-0 bg-[#E1F2FB] justify-center items-center z-[99999]"
      style={animatedContainerStyle}
    >
      {/* Background Decorators */}
      {/* Top right circles */}
      <View className="absolute w-[280px] h-[280px] rounded-full bg-white/40 -top-[100px] -right-[100px]" />
      <View className="absolute w-[240px] h-[240px] rounded-full bg-white/20 -top-[80px] -right-[40px]" />

      {/* Giant Background Letters */}
      <Text
        className="absolute font-black text-white/35 rotate-[-15deg]"
        style={{
          fontSize: width * 1.1,
          bottom: -width * 0.3,
          left: -width * 0.2,
          fontFamily: "System",
        }}
      >
        K
      </Text>
      <Text
        className="absolute font-black text-white/35 rotate-[10deg]"
        style={{
          fontSize: width * 1.1,
          bottom: -width * 0.2,
          right: -width * 0.3,
          fontFamily: "System",
        }}
      >
        O
      </Text>

      <View className="items-center justify-center">
        {/* Central Logo with White Card Container */}
        <Animated.View
          className="bg-white rounded-[36px] p-6 shadow-2xl mb-6"
          style={animatedLogoStyle}
        >
          <Image
            source={require("@/assets/images/tikoSmart.png")}
            className="w-[110px] h-[110px]"
            resizeMode="contain"
          />
        </Animated.View>

        {/* Text Items */}
        <Animated.View className="items-center" style={animatedTextStyle}>
          <Text className="text-[34px] font-black text-[#162840] tracking-[1.5px] mb-2">
            TIKOSMART
          </Text>
          <Text className="text-[13px] font-semibold text-[#008CE2] tracking-[4px] uppercase">
            KINH DOANH BỨT PHÁ
          </Text>
        </Animated.View>
      </View>

      {/* Loading/Pagination Dots at the bottom */}
      <View className="flex-row absolute bottom-[50px] gap-2">
        <View className="w-1.5 h-1.5 bg-[#008CE2]/30 rounded-full" />
        <View className="w-1.5 h-1.5 bg-[#008CE2]/80 rounded-full" />
        <View className="w-1.5 h-1.5 bg-[#008CE2]/30 rounded-full" />
      </View>
    </Animated.View>
  );
}
