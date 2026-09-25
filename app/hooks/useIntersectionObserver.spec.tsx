import { act, render, screen } from "@testing-library/react";
import { useIntersectionObserver } from "./useIntersectionObserver";

const disconnect = jest.fn();
const observe = jest.fn();
let observerCallback: IntersectionObserverCallback;

class IntersectionObserverMock {
  disconnect = disconnect;
  observe = observe;
  root = null;
  rootMargin = "";
  thresholds = [];
  takeRecords = jest.fn(() => []);
  unobserve = jest.fn();

  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }
}

function ObserverTarget({
  enabled = true,
  onIntersect,
}: {
  enabled?: boolean;
  onIntersect: () => void;
}) {
  const { isSupported, targetRef } = useIntersectionObserver({
    enabled,
    onIntersect,
  });

  return (
    <div
      ref={targetRef}
      data-testid="target"
      data-supported={String(isSupported)}
    />
  );
}

describe("useIntersectionObserver", () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    jest.clearAllMocks();
    window.IntersectionObserver =
      IntersectionObserverMock as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    window.IntersectionObserver = originalIntersectionObserver;
  });

  it("observes the target, triggers once on intersection, and disconnects", () => {
    const onIntersect = jest.fn();
    const { unmount } = render(<ObserverTarget onIntersect={onIntersect} />);

    expect(screen.getByTestId("target")).toHaveAttribute(
      "data-supported",
      "true",
    );
    expect(observe).toHaveBeenCalledWith(screen.getByTestId("target"));

    act(() => {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(onIntersect).not.toHaveBeenCalled();

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(onIntersect).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);

    unmount();
    expect(disconnect).toHaveBeenCalledTimes(2);
  });

  it("disconnects when disabled and does not observe again", () => {
    const onIntersect = jest.fn();
    const { rerender } = render(
      <ObserverTarget enabled onIntersect={onIntersect} />,
    );

    expect(observe).toHaveBeenCalledTimes(1);

    rerender(<ObserverTarget enabled={false} onIntersect={onIntersect} />);

    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(1);
  });

  it("reports when Intersection Observer is unavailable", () => {
    window.IntersectionObserver =
      undefined as unknown as typeof IntersectionObserver;

    render(<ObserverTarget onIntersect={jest.fn()} />);

    expect(screen.getByTestId("target")).toHaveAttribute(
      "data-supported",
      "false",
    );
    expect(observe).not.toHaveBeenCalled();
  });
});
