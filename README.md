# Mezz

📐 Mezz is a set of react hooks for building responsive and adaptable web interfaces.

These hooks observe the size of elements and match the breakpoints you supply — simple, type-safe, and fast.

<p><img src="./.github/preview-usewidth.png" width="650" alt="Typesafe completions screenshot" /></p>

- 💪 Type-safe breakpoint auto-completions
- ✨ Uses the modern [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) browser API
- ⚡️ Customizable breakpoint naming
- 🌐 Works in all modern browsers

## The hooks

These hooks have similarities to [`@container` queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries) in css:

- <a href="#usewidth">🪝&nbsp;useWidth</a> - Observe the width of a jsx element (simplest api)
- <a href="#usewidthheight">🪝&nbsp;useWidthHeight</a> - Observe the width _and height_ of a jsx element

And this hook works like a traditional `@media` query:

- <a href="#usebodywidth">🪝&nbsp;useBodyWidth</a> - Observe the width of document.body

## Why not use `window.matchMedia`?

Mezz recognizes that elements can change size dynamically without the user resizing the window. For instance, interactions like opening and closing sidebars can cause adjacent content to adjust its width.

Unlike alternative size matching libraries built with [`window.matchMedia`](https://usehooks-ts.com/react-hook/use-media-query#hook), which **only matches full browser window sizes**, Mezz allows developers to observe and respond to the size of specific elements within the DOM.

## Why not use container queries?

While container queries enable styling within CSS, they lack the capability to conditionally render components or map to component props in TypeScript.

For instance, hiding content with CSS still renders it in the browser, impacting performance. Mezz, on the other hand, allows for conditional rendering based on container size, potentially improving performance by avoiding unnecessary rendering and layout calculations.

## Getting started

```shell
npm install mezz
```

And then import one of these hooks:

[](#usewidth)

### useWidth

Observe the width of a jsx element:

```tsx
import { useWidth } from 'mezz'

function App() {
  const box = useWidth({ lg: 700 })
  return (
    <div ref={box.ref}>
      <p>Active breakpoint: {box.active}</p>
      {'// Use as a conditional'}
      {box.lg ? <LargeView /> : <SmallView />}
      {'// Or as a prop'}
      <Sidebar isPinned={box.lg} />;
    </div>
  )
}
```

Add more breakpoints for each of your component width sizes:

```tsx
import { useWidth } from 'mezz'

function App() {
  const box = useWidth({ sm: 0, md: 400, lg: 600 })
  return (
    <>
      <p>Active breakpoint: {box.active}</p>
      {box.sm && <SmallView />}
      {box.md && <MediumView />}
      {box.lg && <LargeView />}
    </>
  )
}
```

> Breakpoints can be named `xxs/xs/sm/md/lg/xl/xxl` or customized (see [Customisation](#customisation)).

Add a custom throttle value to control the number of times the breakpoint is updated:

```tsx
const box = useWidth(
  { lg: 600 },
  { throttleWait: 500 } // Default value
)
```

[](#usewidthheight)

### useWidthHeight

Observe the width and height of a jsx element:

```tsx
import { useWidthHeight } from 'mezz'

function App() {
  const box = useWidthHeight({
    width: { sm: 0, lg: 800 },
    height: { lg: 500 },
  })
  return (
    <div ref={box.ref}>
      <p>Active width breakpoint: {box.width.active}</p>
      <p>Active height breakpoint: {box.height.active}</p>
      {'// Use as a conditional'}
      {box.width.sm && <SmallView />}
      {box.width.lg && <LargeView isExpanded={box.height.lg} />}
      {'// Or as a prop'}
      <Item hasOverlay={!box.width.lg} />;
    </div>
  )
}
```

Rather than using the produced ref, you can also pass in an existing ref:

```tsx
const myRef = useRef(null)
const box = useWidthHeight({ width: { lg: 800 }, ref: myRef })
```

Add a custom throttle value to control the number of times the breakpoint is updated:

```tsx
const box = useWidthHeight({
  width: { lg: 800 },
  throttleWait: 500, // Default value
})
```

[](#usebodywidth)

### useBodyWidth

Observe the width of `document.body` and change layout based on a breakpoint of 500px body width:

```tsx
import { useBodyWidth } from 'mezz'

function App() {
  const body = useBodyWidth({ lg: 500 })
  return (
    <>
      <p>Active breakpoint: {body.active}</p>
      {'// Use as a conditional'}
      {body.lg ? <LargeLayout /> : <SmallLayout />}
      {'// Or as a prop'}
      <MyComponent hasOverlay={!body.lg} />;
    </>
  )
}
```

Add more sizes for each of your body-width breakpoints:

```tsx
import { useBodyWidth } from 'mezz'

function App() {
  const body = useBodyWidth({ sm: 0, md: 400, lg: 600 })
  return (
    <>
      <p>Active breakpoint: {body.active}</p>
      {body.sm && <SmallLayout />}
      {body.md && <MediumLayout />}
      {body.lg && <LargeLayout />}
    </>
  )
}
```

Add a custom throttle value to control the number of times the breakpoint is updated:

```tsx
const body = useBodyWidth(
  { lg: 600 },
  { throttleWait: 500 } // Default value
)
```

## Customisation

### Breakpoint naming

Out-of-the-box mezz offers these breakpoint names to use: `xxs/xs/sm/md/lg/xl/xxl`.

Customize by wrapping any of the hooks and passing in your own breakpoint names:

#### Using `useBodyWidth`

```tsx
import { useBodyWidth, CustomBreakpoint } from 'mezz'

type BPoints = 'small' | 'medium' | 'large'

const useBodySize = <W extends BPoints>(
  params: CustomBreakpoint<W> & { active?: boolean }
) => useBodyWidth<W>(params)

function App() {
  const body = useBodySize({ small: 0, medium: 400, large: 800 })
  return (
    <div>
      <p>Active breakpoint: {body.active}</p>
      {body.small && <SmallLayout />}
      {body.medium && <MediumLayout />}
      {body.large && <LargeLayout />}
    </div>
  )
}
```

#### Using `useWidthHeight`

```tsx
import { useWidthHeight, CustomBreakpoint } from 'mezz'

type BPoints = 'small' | 'medium' | 'large'

const useBreakpoints = <W extends BPoints, H extends BPoints>(params: {
  width: CustomBreakpoint<W>
  height: CustomBreakpoint<H>
}) => useWidthHeight<W, H>(params)

function App() {
  const bp = useBreakpoints({
    width: { small: 0, large: 1024 },
    height: { large: 500 },
  })
  return (
    <div ref={bp.ref}>
      <p>Active width breakpoint: {bp.width.active}</p>
      <p>Active height breakpoint: {bp.height.active}</p>
      {bp.width.small && <SmallView />}
      {bp.width.large && <LargeView isExpanded={bp.height.large} />}
    </div>
  )
}
```

#### Syncing screens with Tailwind

Mezz can be used with [Tailwind CSS](https://tailwindcss.com/) to match the same breakpoints you've defined in your `tailwind.config.js` file.

Here’s how to sync the hook `useBodyWidth` with your Tailwind screens config.

First, we need to extract and export the screens object from `tailwind.config.js`. You’ll need to define your screens in the below format:

```tsx
// tailwind.config.ts
export const screens = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

const config = {
  theme: {
    screens,
    // ...
  },
  // ...
} satisfies Config

export default config
```

Next we create a provider and use the screens object to generate the breakpoint config:

```tsx
// breakpointProvider.tsx
import { useContext, createContext, useMemo } from 'react'
import { useBodyWidth } from 'mezz'
import { getTailwindBodyWidthConfig } from 'mezz/tailwind'
import { screens } from '../../tailwind.config'
import type { ReactNode } from 'react'

const mezzBodyWidthConfig = getTailwindBodyWidthConfig(screens)

type BodyWidthKeys = keyof typeof mezzBodyWidthConfig
type BreakpointContextType = ReturnType<typeof useBodyWidth<BodyWidthKeys>>

export const BreakpointProvider = (props: { children: ReactNode }) => {
  const cachedMezzConfig = useMemo(() => mezzBodyWidthConfig, [])
  const size = useBodyWidth(cachedMezzConfig)

  return (
    <BreakpointContext.Provider value={size}>
      {props.children}
    </BreakpointContext.Provider>
  )
}

const BreakpointContext = createContext<BreakpointContextType | null>(null)

export const useBreakpoint = () => {
  const context = useContext(BreakpointContext)
  if (!context) {
    throw new Error('useBreakpoint must be used within a BreakpointProvider')
  }

  return context
}
```

Next, wrap your app with the `BreakpointProvider` above.

Then use your tailwind body width context like this:

```tsx
const Component = () => {
  const bp = useBreakpoint()
  //    ^? const bp: { active: "sm" | "md" | "lg" | "xl" | "custom" | null; }
  //       & Record<"sm" | "md" | "lg" | "xl" | "custom", boolean>

  return <>{!bp.xs && `I'm not small`}</>
}
```
