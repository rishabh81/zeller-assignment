jest.mock('react-native-reanimated', () => {
    const sharedValues = new Set();
  
    return {
      useSharedValue: (initial) => {
        const obj = { value: initial };
        sharedValues.add(obj);
        return obj;
      },
  
      withTiming: (value) => value,
  
      interpolate: (value, input, output) => {
        const index = input.indexOf(value);
        return index !== -1 ? output[index] : output[0];
      },
  
      useAnimatedStyle: (styleFn) => {
        return {
          get value() {
            return styleFn();
          },
        };
      },
  
      Easing: {},
    };
  });
  