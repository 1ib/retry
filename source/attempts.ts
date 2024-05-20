export const META_KEY_ATTEMPTS_INDEX = "meta:attempts.index"

export function attempts(
    target: Object,
    property: string | symbol,
    index: number,
) {
    Reflect.defineMetadata(META_KEY_ATTEMPTS_INDEX, index, target, property)
}
