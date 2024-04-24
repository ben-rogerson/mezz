# Mezz

[![npm](https://img.shields.io/npm/v/mezz?colorA=fdbe90&colorB=fffaeb)](https://www.npmjs.com/package/mezz)
[![downloads](https://img.shields.io/npm/dm/mezz?colorA=fdbe90&colorB=fffaeb)](https://www.npmjs.com/package/mezz)
[![minzip package size](https://img.shields.io/bundlephobia/minzip/mezz?label=minzip%20size&colorA=fdbe90&colorB=fffaeb)](https://bundlephobia.com/package/mezz)

📐 Mezz is a set of React hooks for building responsive and adaptable web interfaces.

The hooks observe the size of elements and match the breakpoints you supply — simple, type-safe, and fast.

<p><img src="./.github/preview-usewidth.png" width="650" alt="Typesafe completions screenshot" /></p>

- 💪 Type-safe breakpoint auto-completions
- ✨ Uses the modern [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) browser API
- ⚡️ Customizable breakpoint naming
- 🌐 Works in all modern browsers

[👉 **Demos and examples &rsaquo;**](https://mezz.benrogerson.dev/)

## Install

```shell
pnpm install mezz
```

## Use

The **useWidth** hook:

```tsx
import { useWidth } from 'mezz'

function BlueBox() {
  const width = useWidth({ lg: 500 })
  return <div ref={width.ref}>{width.lg ? 'Large' : 'Small'}</div>
}
```

The **useWidthHeight** hook:

```tsx
import { useWidthHeight } from 'mezz'

function GreenBox() {
  const size = useWidthHeight({
    width: { sm: 0, md: 400, lg: 500 },
    height: { lg: 950 },
  })

  return (
    <div ref={size.ref}>
      {size.width.sm && 'Small'}
      {size.width.md && 'Medium'}
      {size.width.lg && 'Large'}
      {size.height.lg && 'Larger height'}
    </div>
  )
}
```

The **useBodyWidth** hook:

```tsx
import { useBodyWidth } from 'mezz'

function App() {
  const body = useBodyWidth({ lg: 500 })
  return body.lg ? 'Large' : 'Small'
}
```

[👉 **More demos and examples &rsaquo;**](https://mezz.benrogerson.dev/)

---

[Consider donating some 🍕 if you enjoy!](https://www.buymeacoffee.com/benrogerson)
