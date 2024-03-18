/**
 * Convert a tailwind.config screens object into a body width config object.
 * Tailwind screens must follow this format: `{ screens: { sm: '375px' }}`
 * Max-width breakpoints aren’t supported, eg: `{ '2xl': { 'max': '1535px' }}`
 */
export const getBodyWidthConfig = <T extends string>(
  screens: Record<T, string>
) => {
  const configPairs = Object.entries<string>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    screens
  ).map(
    ([key, value]) => [key as T, Number.parseInt(value)],
    []
  ) satisfies Array<[T, number]>

  // Sort the pairs by the width - order is required for mezz
  configPairs.sort((a, b) => a[1] - b[1])

  if (configPairs[0][1] !== 0) {
    // Replace the first key with a 0 width one if it doesn't exist.
    // This makes it easer to target small width sizes.
    configPairs[0][1] = 0
  }

  const config = Object.fromEntries(configPairs) as Record<T, number>

  return config
}
