# retry

A TypeScript utility for retrying sync/async methods that throw errors.

Basic usage:

```ts
import { limit } from "@1ib/retry"

class Case1 {
  // Use the `limit` decorator to retry a method if it throws an error,
  // for a maximum of 3 tries.
  @limit(3)
  foo() {
    // This method can return anything or throw an error.
  }
}

const case = new Case1()
const result = case.foo()
```

For `async` methods:

```ts
class Case2 {
  // Same as Case1, but an async function, which means it returns a Promise.
  // It also retries up to 3 times if an error is thrown.
  @limit(3)
  async foo() {
    // This method can return anything or throw an error.
  }
}

const case = new Case2()
const result = await case.foo()
```

For custom retry logic:

```ts
interface Result {
    // You can customize the flag to determine whether to retry
    // This case we use the `needRetry` property
    needRetry: boolean
}

class Case3 {
    // This `limit` decorator takes two arguments.
    // The first is the maximum retry count (3).
    // The second argument is a function that decides whether to retry based on
    // the result or error.
    // In this case, If the result has a property `needRetry` set to true,
    // the method will retry.
    @limit(3, ({ needRetry }: Result | Error) => needRetry)
    foo() {
        // This method can return a `Result` or throw an error.
    }
}
```

## Install

### Node.js

Install using [npm][npm] or [yarn][yarn]:

```
npm install @1ib/retry

# or

yarn add @1ib/retry
```

Import into your Node.js project:

```js
// CommonJS
const { retry } = require("@1ib/retry")

// ESM
import { retry } from "@1ib/retry"
```

### Deno

Install using [JSR](https://jsr.io):

```shell
deno add @1ib/retry

#or

jsr add @1ib/retry
```

Then import into your Deno project:

```js
import { retry } from "@1ib/retry"
```

### Bun

Install using this command:

```
bun add @1ib/retry
```

Import into your Bun project:

```js
import { retry } from "@1ib/retry"
```

### Browser

It's recommended to import the minified version to save bandwidth:

```js
import { retry } from "https://cdn.skypack.dev/@1ib/retry?min"
```

However, you can also import the unminified version for debugging purposes:

```js
import { retry } from "https://cdn.skypack.dev/@1ib/retry"
```

## License

This project is licensed under the MIT.

## Author

[kingcc](https://github.com/kingcc)

---

Feel free to customize this template according to the needs of your package. If your package requires more complex setup, it's good to include detailed instructions on configuration, API references, and a changelog. Always ensure that the documentation is up to date with the latest code changes.
