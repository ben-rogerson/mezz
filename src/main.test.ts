import { renderHook } from '@testing-library/react-hooks'
import { describe, test, expect, expectTypeOf } from 'vitest'
import { useWidth, useWidthHeight, useBodyWidth, getSizes } from './main'

/**
 * @avoids 'ReferenceError: ResizeObserver is not defined'
 * @see https://github.com/ZeeCoder/use-resize-observer/issues/40
 */
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('Breakpoint hooks', () => {
  window.ResizeObserver = ResizeObserver

  describe('useBodyWidth', () => {
    describe('Given a custom width config', () => {
      describe('When called', () => {
        test('Then return matching breakpoints', async () => {
          const hook = renderHook(() =>
            useBodyWidth({ md: 0, xl: 1000, xxl: 2000 })
          )
          expect(hook.result.current).toEqual({
            active: 'md',
            md: true,
            xl: false,
            xxl: false,
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<
            Record<'md' | 'xl' | 'xxl', boolean>
          >()
        })
      })
    })

    describe('Given config.throttleWait', () => {
      describe('When called', () => {
        test('Then avoid error', async () => {
          const hook = renderHook(() =>
            useBodyWidth({ lg: 500 }, { throttleWait: 100 })
          )
          expect(hook.result.current).toEqual({
            active: null,
            lg: false,
          })
          expect(hook.result.error).toBeUndefined()
          expectTypeOf(hook.result.current).toMatchTypeOf<
            Record<'lg', boolean>
          >()
        })
      })
    })
  })

  describe('useWidth', () => {
    describe('Given no width config', () => {
      describe('When called', () => {
        test('Then the default config is used', async () => {
          const hook = renderHook(() => useWidth({ md: 0, xl: 300 }))
          expect(hook.result.current).toEqual({
            active: 'md',
            md: true,
            xl: false,
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<
            Record<'md' | 'xl', boolean> & {
              ref: React.RefCallback<Element>
            }
          >()
        })
      })
    })

    describe('Given a custom width config', () => {
      describe('When called', () => {
        test('Then return matching breakpoints', async () => {
          const hook = renderHook(() =>
            useWidth({ md: 0, xl: 1000, xxl: 2000 })
          )
          expect(hook.result.current).toEqual({
            active: 'md',
            md: true,
            xl: false,
            xxl: false,
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<
            Record<'md' | 'xl' | 'xxl', boolean> & {
              ref: React.RefCallback<Element>
            }
          >()
        })
      })
    })

    describe('Given config.throttleWait', () => {
      describe('When called', () => {
        test('Then avoid error', async () => {
          const hook = renderHook(() =>
            useWidth({ lg: 400 }, { throttleWait: 100 })
          )
          expect(hook.result.current).toEqual({
            active: null,
            lg: false,
            ref: expect.any(Function),
          })
          expect(hook.result.error).toBeUndefined()
          expectTypeOf(hook.result.current).toMatchTypeOf<
            Record<'lg', boolean> & { ref: React.RefCallback<Element> }
          >()
        })
      })
    })
  })

  describe('useWidthHeight', () => {
    describe('Given no config', () => {
      describe('When called', () => {
        test('Then throw error', async () => {
          expect(() =>
            // @ts-expect-error Testing invalid use
            useWidthHeight()
          ).toThrow('No breakpoints specified')
        })
      })
    })

    describe('Given a value that’s a string', () => {
      describe('When called', () => {
        test('Then throw error', async () => {
          const widthTest = renderHook(() =>
            useWidthHeight({
              width: {
                // @ts-expect-error Testing invalid use
                md: '100px',
              },
            })
          )
          expect(widthTest.result.error).toEqual(
            Error(
              'Breakpoint value must be a number, eg: `{ md: 100 }`. Found: `{ md: "100px" }`'
            )
          )
          const heightTest = renderHook(() =>
            useWidthHeight({
              height: {
                // @ts-expect-error Testing invalid use
                md: '100px',
              },
            })
          )
          expect(heightTest.result.error).toEqual(
            Error(
              'Breakpoint value must be a number, eg: `{ md: 100 }`. Found: `{ md: "100px" }`'
            )
          )
        })
      })
    })

    describe('Given a value that’s a negative number', () => {
      describe('When called', () => {
        test('Then throw error', async () => {
          const widthTest = renderHook(() =>
            useWidthHeight({
              width: {
                md: -100,
              },
            })
          )
          expect(widthTest.result.error).toEqual(
            Error(
              'The breakpoint `width: { md: -100 }` can’t have a value lower than 0'
            )
          )
          const heightTest = renderHook(() =>
            useWidthHeight({
              height: {
                // @ts-expect-error Testing invalid use
                md: '100px',
              },
            })
          )
          expect(heightTest.result.error).toEqual(
            Error(
              'Breakpoint value must be a number, eg: `{ md: 100 }`. Found: `{ md: "100px" }`'
            )
          )
        })
      })
    })

    describe('Given no "width" nor "height" key', () => {
      describe('When called', () => {
        test('Then throw error', async () => {
          expect(() => useWidthHeight({})).toThrow('No breakpoints specified')
        })
      })
    })

    describe('Given an empty "width" config', () => {
      describe('When called', () => {
        test('Then return an empty width', async () => {
          const hook = renderHook(() => useWidthHeight({ width: {} }))
          expect(hook.result.current).toEqual({
            width: { active: null },
            height: { active: null },
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<{
            width: Record<never, boolean>
            height: Record<never, boolean>
            ref: React.RefCallback<Element>
          }>()
        })
      })
    })

    describe('Given an empty "height" config', () => {
      describe('When called', () => {
        test('Then return an empty height', async () => {
          const hook = renderHook(() => useWidthHeight({ height: {} }))
          expect(hook.result.current).toEqual({
            width: { active: null },
            height: { active: null },
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<{
            width: Record<never, boolean>
            height: Record<never, boolean>
            ref: React.RefCallback<Element>
          }>()
        })
      })
    })

    describe('Given no ref supplied', () => {
      describe('When called', () => {
        test('Then a width breakpoint of zero will be true', async () => {
          const hook = renderHook(() =>
            useWidthHeight({ width: { sm: 0, md: 1000 } })
          )
          expect(hook.result.current).toEqual({
            width: { active: 'sm', sm: true, md: false },
            height: { active: null },
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<{
            width: Record<'sm' | 'md', boolean>
            height: Record<never, boolean>
            ref: React.RefCallback<Element>
          }>()
        })
      })

      test('Then a height breakpoint of zero will be true', async () => {
        const hook = renderHook(() =>
          useWidthHeight({ height: { sm: 0, md: 1000 } })
        )
        expect(hook.result.current).toEqual({
          width: { active: null },
          height: { active: 'sm', sm: true, md: false },
          ref: expect.any(Function),
        })
        expectTypeOf(hook.result.current).toMatchTypeOf<{
          width: Record<never, boolean>
          height: Record<'sm' | 'md', boolean>
          ref: React.RefCallback<Element>
        }>()
      })
    })

    describe('Given breakpoints aren’t supplied in order', () => {
      describe('When called', () => {
        test('Then throw error', async () => {
          try {
            const widthTest = renderHook(() =>
              useWidthHeight({ width: { sm: 1000, md: 500 } })
            )
            expect(widthTest.result.error).toEqual(
              Error(
                'The breakpoint `width: { sm: 1000 }` must be lower than the next breakpoint of `{ md: 500 }`'
              )
            )
            const heightTest = renderHook(() =>
              useWidthHeight({ height: { sm: 1000, md: 500 } })
            )
            expect(heightTest.result.error).toEqual(
              Error(
                'The breakpoint `height: { sm: 1000 }` must be lower than the next breakpoint of `{ md: 500 }`'
              )
            )
            // eslint-disable-next-line no-empty
          } catch {}
        })
      })
    })

    describe('Given only config.throttleWait', () => {
      describe('When called', () => {
        test('Then throw error', async () => {
          expect(() => useWidthHeight({ throttleWait: 100 })).toThrow(
            'No breakpoints specified'
          )
        })
      })
    })

    describe('Given a custom width config', () => {
      describe('When called', () => {
        test('Then return matching breakpoints', async () => {
          const hook = renderHook(() =>
            useWidthHeight({ width: { md: 0, xl: 1000, xxl: 2000 } })
          )
          expect(hook.result.current).toEqual({
            width: { active: 'md', md: true, xl: false, xxl: false },
            height: { active: null },
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<{
            width: Record<'md' | 'xl' | 'xxl', boolean>
            height: Record<never, boolean>
            ref: React.RefCallback<Element>
          }>()
        })
      })
    })

    describe('Given a custom height config', () => {
      describe('When called', () => {
        test('Then return matching breakpoints', async () => {
          const hook = renderHook(() =>
            useWidthHeight({ height: { md: 0, xl: 1000, xxl: 2000 } })
          )
          expect(hook.result.current).toEqual({
            width: { active: null },
            height: { active: 'md', md: true, xl: false, xxl: false },
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<{
            width: Record<never, boolean>
            height: Record<'md' | 'xl' | 'xxl', boolean>
            ref: React.RefCallback<Element>
          }>()
        })
      })
    })

    describe('Given a custom width and height config', () => {
      describe('When called', () => {
        test('Then return matching breakpoints', async () => {
          const hook = renderHook(() =>
            useWidthHeight({
              width: { lg: 0, xl: 1000, xxl: 2000 },
              height: { xs: 0, md: 1000, xxl: 2000 },
            })
          )
          expect(hook.result.current).toEqual({
            width: { active: 'lg', lg: true, xl: false, xxl: false },
            height: { active: 'xs', xs: true, md: false, xxl: false },
            ref: expect.any(Function),
          })
          expectTypeOf(hook.result.current).toMatchTypeOf<{
            width: Record<'lg' | 'xl' | 'xxl', boolean>
            height: Record<'xs' | 'md' | 'xxl', boolean>
            ref: React.RefCallback<Element>
          }>()
        })
      })
    })

    describe('Given config.throttleWait', () => {
      describe('When called', () => {
        test('Then avoid error', async () => {
          const hook = renderHook(() =>
            useWidthHeight({ width: { sm: 100 }, throttleWait: 100 })
          )
          expect(hook.result.current).toEqual({
            width: { active: null, sm: false },
            height: { active: null },
            ref: expect.any(Function),
          })
          expect(hook.result.error).toBeUndefined()
          expectTypeOf(hook.result.current).toMatchTypeOf<{
            width: Record<'sm', boolean>
            height: Record<never, boolean>
            ref: React.RefCallback<Element>
          }>()
        })
      })
    })
  })

  describe('getSizes', () => {
    describe('Given default value', () => {
      describe('When under the lowest breakpoint', () => {
        test('Then everything is false', async () => {
          const config = { size: 1, rules: { sm: 2, md: 1000, lg: 2000 } }

          const widthResult = getSizes({ type: 'width', ...config })
          expect(widthResult).toStrictEqual({
            active: null,
            sm: false,
            md: false,
            lg: false,
          })

          const heightResult = getSizes({ type: 'height', ...config })
          expect(heightResult).toStrictEqual({
            active: null,
            sm: false,
            md: false,
            lg: false,
          })
        })
      })

      describe('When between sm and next breakpoint', () => {
        test('Then sm is true and rest are false', async () => {
          const config = { size: 500, rules: { sm: 0, md: 1000, lg: 2000 } }

          const widthResult = getSizes({ type: 'width', ...config })
          expect(widthResult).toStrictEqual({
            active: 'sm',
            sm: true,
            md: false,
            lg: false,
          })

          const heightResult = getSizes({ type: 'height', ...config })
          expect(heightResult).toStrictEqual({
            active: 'sm',
            sm: true,
            md: false,
            lg: false,
          })
        })
      })

      describe('When between md and lg breakpoints', () => {
        test('Then md is true and rest are false', async () => {
          const config = { size: 1500, rules: { sm: 0, md: 1000, lg: 2000 } }

          const widthResult = getSizes({ type: 'width', ...config })
          expect(widthResult).toStrictEqual({
            active: 'md',
            sm: false,
            md: true,
            lg: false,
          })

          const heightResult = getSizes({ type: 'height', ...config })
          expect(heightResult).toStrictEqual({
            active: 'md',
            sm: false,
            md: true,
            lg: false,
          })
        })
      })

      describe('When above max breakpoint', () => {
        test('Then max breakpoint is true and rest are false', async () => {
          const config = { size: 2500, rules: { sm: 0, md: 1000, lg: 2000 } }

          const widthResult = getSizes({ type: 'width', ...config })

          expect(widthResult).toStrictEqual({
            active: 'lg',
            sm: false,
            md: false,
            lg: true,
          })

          const heightResult = getSizes({ type: 'height', ...config })
          expect(heightResult).toStrictEqual({
            active: 'lg',
            sm: false,
            md: false,
            lg: true,
          })
        })
      })
    })
  })
})
