export const SWIPE_ACTION_WIDTH = 76;
export const SWIPE_SLOP = 10;

export function shouldCaptureSwipe(
  dx: number,
  dy: number,
  open: boolean,
): boolean {
  return (
    Math.abs(dx) > SWIPE_SLOP &&
    Math.abs(dx) > Math.abs(dy) * 1.5 &&
    (open || dx < 0)
  );
}

export function clampSwipe(offset: number, width: number): number {
  return Math.max(-width, Math.min(0, offset));
}

export function shouldOpenSwipe(
  offset: number,
  velocity: number,
  width: number,
): boolean {
  if (velocity > 0.45) return false;
  if (velocity < -0.45) return true;
  return offset < -width * 0.4;
}
