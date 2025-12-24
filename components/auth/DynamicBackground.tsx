import { View, Animated, ImageBackground, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const bgImage = require('@/assets/images/login-background.png');

export default function DynamicBackground() {
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: -screenWidth,
                    duration: 20000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [translateX]);
    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFill,
                {
                    width: screenWidth * 2,
                    height: screenHeight,
                    transform: [{ translateX }],
                },
            ]}
            pointerEvents="none"
        >
            <ImageBackground source={bgImage} style={{ width: '100%', height: '100%' }} resizeMode="cover">
                <View style={styles.overlay} />
            </ImageBackground>
        </Animated.View>
    )
}
const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
});