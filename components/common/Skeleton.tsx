import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface SkeletonProps {
  className?: string; // Để truyền class NativeWind (vd: "h-4 w-20 rounded")
  style?: ViewStyle;  // Để truyền style inline nếu cần kích thước động
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={`bg-gray-300 dark:bg-gray-700 rounded-md ${className}`} 
      style={[{ opacity }, style]}
    />
  );
};

export default Skeleton;