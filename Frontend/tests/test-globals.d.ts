declare const describe: (name: string, fn: () => void | Promise<void>) => void

declare interface ItFunction {
  (name: string, fn: () => void | Promise<void>): void
  each: <T>(cases: readonly T[]) => (name: string, fn: (value: T) => void | Promise<void>) => void
}

declare const it: ItFunction

declare const beforeEach: (fn: () => void | Promise<void>) => void

declare const expect: (actual: unknown) => any

declare const vi: {
  fn: <T extends (...args: any[]) => any>(impl?: T) => jest.MockedFunction<T>
  mock: (moduleName: string, factory?: (...args: any[]) => any) => void
  useFakeTimers: () => void
  advanceTimersByTime: (msToRun: number) => void
  spyOn: <T extends object, K extends keyof T>(obj: T, methodName: K) => any
  hoisted: <T>(factory: () => T) => T
}

declare const jest: {
  fn: <T extends (...args: any[]) => any>(impl?: T) => jest.MockedFunction<T>
  mock: (moduleName: string, factory?: (...args: any[]) => any) => void
  useFakeTimers: () => void
  advanceTimersByTime: (msToRun: number) => void
  spyOn: <T extends object, K extends keyof T>(obj: T, methodName: K) => any
}

declare namespace jest {
  interface MockedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): ReturnType<T>
    mockReset: () => void
    mockClear: () => void
    mockReturnValue: (value: ReturnType<T>) => void
    mockResolvedValue: (value: Awaited<ReturnType<T>>) => void
    mockRejectedValue: (value: unknown) => void
  }
}
