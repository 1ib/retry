import isAsync from "is-async-function"
import { META_KEY_ATTEMPTS_INDEX } from "@/attempts"

function asyncAdaptor(
    adaptor: { sync: Function; async: Function },
    functions: Function[],
) {
    return adaptor[functions.every((fn) => !isAsync(fn)) ? "sync" : "async"]
}

function safety<Fn extends Function>(fn: Fn) {
    return asyncAdaptor(
        {
            sync(...args: unknown[]) {
                try {
                    return fn.apply(this, args)
                } catch (error) {
                    return error
                }
            },
            async async(...args: unknown[]) {
                try {
                    return await fn.apply(this, args)
                } catch (error) {
                    return error
                }
            },
        },
        [fn],
    )
}

export function retry(retries: number): MethodDecorator
export function retry<Fn extends (...args: unknown[]) => unknown>(
    check: (
        resultOrError: ReturnType<Fn> | Error,
        retries: number,
    ) => boolean | Promise<boolean>,
): MethodDecorator
export function retry<Fn extends (...args: unknown[]) => unknown>(
    parameter:
        | number
        | ((
              resultOrError: ReturnType<Fn> | Error | unknown,
              retries: number,
          ) => boolean | Promise<boolean>),
): MethodDecorator {
    const check =
        typeof parameter === "function"
            ? parameter
            : (
                  resultOrError: ReturnType<Fn> | Error | unknown,
                  attempts: number,
              ) => resultOrError instanceof Error && attempts <= parameter
    return <T>(
        target: Object,
        property: string | symbol,
        descriptor: TypedPropertyDescriptor<T>,
    ) => {
        if (typeof descriptor.value === "function") {
            const method = descriptor.value

            descriptor.value = asyncAdaptor(
                {
                    sync(...args: unknown[]) {
                        let attempts = 0
                        let resultOrError: ReturnType<Fn> | Error

                        do {
                            const parameterIndex = Reflect.getMetadata(
                                META_KEY_ATTEMPTS_INDEX,
                                target,
                                property,
                            )
                            if (typeof parameterIndex === "number") {
                                args[parameterIndex] = attempts
                            }
                            resultOrError = safety(method).apply(this, args)
                        } while (check(resultOrError, ++attempts))

                        if (resultOrError instanceof Error) throw resultOrError

                        return resultOrError
                    },
                    async async(...args: unknown[]) {
                        let attempts = 0
                        let resultOrError: ReturnType<Fn> | Error

                        do {
                            const parameterIndex = Reflect.getMetadata(
                                META_KEY_ATTEMPTS_INDEX,
                                target,
                                property,
                            )
                            if (typeof parameterIndex === "number") {
                                args[parameterIndex] = attempts
                            }
                            resultOrError = await safety(method).apply(
                                this,
                                args,
                            )
                        } while (await check(resultOrError, ++attempts))

                        if (resultOrError instanceof Error) throw resultOrError

                        return resultOrError
                    },
                },
                [method, check],
            ) as any
        }

        return descriptor
    }
}
