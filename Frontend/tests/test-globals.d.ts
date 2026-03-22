declare const describe: (name: string, fn: () => void | Promise<void>) => void

declare interface ItFunction {
  (name: string, fn: () => void | Promise<void>): void
  each: <T>(cases: readonly T[]) => (name: string, fn: (value: T) => void | Promise<void>) => void
}

declare const it: ItFunction

declare const beforeEach: (fn: () => void | Promise<void>) => void

declare const expect: (actual: unknown) => unknown

declare const vi: {
  fn: <T extends (...args: unknown[]) => unknown>(impl?: T) => jest.MockedFunction<T>
  mock: (moduleName: string, factory?: (...args: unknown[]) => unknown) => void
  useFakeTimers: () => void
  advanceTimersByTime: (msToRun: number) => void
  spyOn: <T extends object, K extends keyof T>(
    obj: T,
    methodName: K,
  ) => jest.MockedFunction<T[K] extends (...args: unknown[]) => unknown ? T[K] : never>
  hoisted: <T>(factory: () => T) => T
}

declare const jest: {
  fn: <T extends (...args: unknown[]) => unknown>(impl?: T) => jest.MockedFunction<T>
  mock: (moduleName: string, factory?: (...args: unknown[]) => unknown) => void
  useFakeTimers: () => void
  advanceTimersByTime: (msToRun: number) => void
  spyOn: <T extends object, K extends keyof T>(
    obj: T,
    methodName: K,
  ) => jest.MockedFunction<T[K] extends (...args: unknown[]) => unknown ? T[K] : never>
}

declare namespace jest {
  interface MockedFunction<T extends (...args: unknown[]) => unknown> {
    (...args: Parameters<T>): ReturnType<T>
    mockReset: () => void
    mockClear: () => void
    mockReturnValue: (value: ReturnType<T>) => void
    mockResolvedValue: (value: Awaited<ReturnType<T>>) => void
    mockRejectedValue: (value: unknown) => void
  }
}
