import { renderHook, act } from '@testing-library/react-native';
import { useTabAnimation } from './tabAnimation.hook';

describe('useTabAnimation', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useTabAnimation());

    expect(result.current.updateAnimation).toBeDefined();
    expect(result.current.tabIndicatorStyle).toBeDefined();
  });

  it('moves indicator to page 0', () => {
    const { result } = renderHook(() => useTabAnimation());

    act(() => {
      result.current.updateAnimation(0);
    });

    expect(
      result.current.tabIndicatorStyle.value.transform[0].translateX
    ).toBe(0);
  });

  it('moves indicator to page 1', () => {
    const { result } = renderHook(() => useTabAnimation());

    act(() => {
      result.current.updateAnimation(1);
    });

    expect(
      result.current.tabIndicatorStyle.value.transform[0].translateX
    ).toBe(90);
  });

  it('moves indicator to page 2', () => {
    const { result } = renderHook(() => useTabAnimation());

    act(() => {
      result.current.updateAnimation(2);
    });

    expect(
      result.current.tabIndicatorStyle.value.transform[0].translateX
    ).toBe(180);
  });
});
