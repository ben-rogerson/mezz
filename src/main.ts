import { useMemo, useState } from 'react'
import { throttle } from 'throttle-debounce'
import useResizeObserver from 'use-resize-observer'

type UseResizeObserverConfig = NonNullable<
  Parameters<typeof useResizeObserver>[0]
>

/**
 * List of blessed breakpoint keys to use.
 */
const BREAKPOINTS = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
type Breakpoints = (typeof BREAKPOINTS)[number]

/**
 * @description Retrieves width data for document.body. Breakpoints are preset but may be specified.
 * @example
 * // Define the different element views as pixel widths:
 * const body = useBodyWidth({ lg: 1200 });
 * // Add a large component when body width >=1200px, otherwise add a small component:
 * {body.lg ? <LargeView /> : <SmallView />}
 * @example
 * // Add a different component for every breakpoint width:
 * {body.lg && <LargeView /> || body.md && <MediumView /> || <SmallView />}
 */
const useBodyWidth = <W extends string = Breakpoints>(
  /**
   * @description An object containing the breakpoint as the key and the pixel width as the number value. The breakpoint values must be in ascending order.
   * @default { sm: 0, md: 768, lg: 1200 }
   */
  configWidth: Partial<Record<W, number>>,
  config?: {
    /**
     * @description The number of milliseconds to wait while running the throttle function.
     * @default 500
     */
    throttleWait?: number
  }
) => {
  const { width } = useWidthHeight<W>({
    width: configWidth,
    throttleWait: config?.throttleWait,
    ref: document.body,
  })

  return width
}

/**
 * @description Retrieves width data for a given element.
 * @example
 * // Define the different element views as pixel widths:
 * const box = useWidth({ sm: 0, md: 200, lg: 300 });
 * // Add a large component when container width >=300px, otherwise add a small component:
 * <div ref={box.ref}>{box.lg ? <LargeView /> : <SmallView />}</div>
 * @example
 * // Add a different component for every breakpoint width:
 * <div ref={box.ref}>{box.lg && <LargeView /> || box.md && <MediumView /> || <SmallView />}</div>
 */
const useWidth = <W extends string = Breakpoints>(
  /**
   * @description An object containing the breakpoint as the key and the pixel width as the number value. The breakpoint values must be in ascending order.
   * @example { sm: 0, md: 200, lg: 300 }
   */
  configWidth: Partial<Record<W, number>>,
  config?: {
    /**
     * @description The number of milliseconds to wait while running the throttle function.
     * @default 500
     */
    throttleWait?: number
  }
) => {
  const container = useWidthHeight<W>({
    width: configWidth,
    throttleWait: config?.throttleWait,
  })

  return { ...container.width, ref: container.ref }
}

/**
 * @description Retrieves width and height data for a given element. Use it to conditionally render components based on another elements width or height. Breakpoints are preset but may be overridden.
 * @example
 * // Define the different element views as pixel widths:
 * const box = useWidthHeight({ width: { sm: 0, lg: 300 }, height: { sm: 0, lg: 200 }});
 * // Add a large component when element width >=300px, otherwise add a small component:
 * {box.width.lg ? <LargeView /> : <SmallView />}
 * @example
 * // Use a different component for every breakpoint width:
 * {(box.width.sm && <SmallView />) ?? (box.width.md && <MediumView />) ?? (box.width.lg && <LargeView />)}
 */
const useWidthHeight = <
  W extends string = Breakpoints,
  H extends string = Breakpoints
>(params: {
  /**
   * @description An object containing the breakpoint as the key and the pixel width as the number value. The breakpoint values must be in ascending order.
   * @example { width: { sm: 0, md: 200, lg: 300 }}
   */
  width?: Partial<Record<W, number>>
  /**
   * @description An object containing the breakpoint as the key and the pixel height as the number value. The breakpoint values must be in ascending order.
   * @example { height: { sm: 0, md: 200, lg: 300 }}
   */
  height?: Partial<Record<H, number>>
  /**
   * @description An optional predefined reference element to observe.
   */
  ref?: Element | React.RefObject<Element> | null | undefined
  /**
   * @description The number of milliseconds to wait while running the throttle function.
   * @default 500
   */
  throttleWait?: number
}) => {
  if (!params || (!params.width && !params.height)) {
    throw new Error('No breakpoints specified')
  }

  const config = { ...(params.ref && { ref: params.ref }) }
  const { ref, width, height } = useThrottledResizeObserver(
    params.throttleWait ?? 500,
    config
  )

  return {
    width: getSizes<W>({ type: 'width', size: width, rules: params.width }),
    height: getSizes<H>({ type: 'height', size: height, rules: params.height }),
    ref,
  }
}

type ValidateBreakpointsParams = {
  type: 'width' | 'height'
  title: string
  minBp: number
  maxBp: number
  nextEntry: [string, number]
}

const validationRules: [
  (params: { minBp: number; maxBp: number }) => boolean,
  (params: ValidateBreakpointsParams) => string
][] = [
  [
    params => typeof params.minBp !== 'number',
    params =>
      `Breakpoint value must be a number, eg: \`{ ${
        params.title
      }: 100 }\`. Found: \`{ ${params.title}: ${JSON.stringify(
        params.minBp
      )} }\``,
  ],
  [
    // Avoid 'Infinity' values
    params => !isFinite(params.minBp),
    params =>
      `The breakpoint \`${params.type}: { ${params.title}: ${params.minBp} }\` must be finite`,
  ],
  [
    params => Boolean(params.maxBp && params.maxBp < params.minBp),
    params =>
      `The breakpoint \`${params.type}: { ${params.title}: ${params.minBp} }\` must be lower than the next breakpoint of \`{ ${params.nextEntry[0]}: ${params.nextEntry[1]} }\``,
  ],
  [
    params => params.minBp < 0,
    params =>
      `The breakpoint \`${params.type}: { ${params.title}: ${params.minBp} }\` can’t have a value lower than 0`,
  ],
]

const getSizes = <T extends string = Breakpoints>(params: {
  type: 'width' | 'height'
  size?: number
  rules?: Partial<Record<T, number>> | undefined
}) => {
  const sizePx = params.size ?? 0
  const ruleList = Object.entries(params.rules ?? {}) as Array<[T, number]>
  const sizes: Array<[T, boolean]> = []
  const BREAKPOINT_FRACTION = 0.01

  let active: T | null = null

  for (const entry of Object.entries(ruleList)) {
    const [index, [title, minBp]] = entry

    const nextEntry = ruleList[Number(index) + 1]
    const maxBp = nextEntry?.[1] - BREAKPOINT_FRACTION ?? null
    const isCurrentBp = sizePx === minBp || (sizePx > minBp && sizePx < maxBp)
    const isWithinLastBp =
      ruleList.length === Number(index) + 1 && sizePx >= minBp

    for (const [condition, message] of validationRules) {
      if (!condition({ minBp, maxBp })) continue
      throw new Error(
        message({
          type: params.type,
          nextEntry,
          title,
          minBp,
          maxBp,
        })
      )
    }

    const isActive = isCurrentBp || isWithinLastBp

    active = isActive ? title : active

    sizes.push([title, isActive])
  }

  return {
    active,
    ...(Object.fromEntries(sizes) as Record<T, boolean>),
  }
}

const useThrottledResizeObserver = (
  throttleWait: number,
  config?: UseResizeObserverConfig
) => {
  const [size, setSize] = useState<{ width?: number; height?: number }>()
  const onResize = useMemo(
    () => throttle(throttleWait, setSize),
    [throttleWait]
  )
  const { ref } = useResizeObserver({
    // Use border-box for consistent sizing
    box: 'border-box',
    onResize,
    ...config,
  })
  return { ref, ...size }
}

type CustomBreakpoint<W extends string> = Partial<Record<W, number>>

export { useWidth, useWidthHeight, useBodyWidth, getSizes }
export type { Breakpoints, UseResizeObserverConfig, CustomBreakpoint }
