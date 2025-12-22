import {
    useSharedValue, useAnimatedStyle, withTiming, interpolate
} from 'react-native-reanimated';

export const useTabAnimation = () => {
    const animatedValue = useSharedValue(0)

    const updateAnimation = (page: number) => {
        animatedValue.value = withTiming(page);
    }

    const tabIndicatorStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            animatedValue.value,
            [0,1,2],
            [0,90,180],
        );
        return {
            transform:[{translateX: withTiming(translateX)}]
        }
    })
    return{
        updateAnimation,
        tabIndicatorStyle,
    }
}