export function withTimeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<{ timedOut: false; value: T } | { timedOut: true }> {
  return Promise.race([
    promise.then((value) => ({ timedOut: false as const, value })),
    new Promise<{ timedOut: true }>((resolve) => setTimeout(() => resolve({ timedOut: true }), ms)),
  ])
}
