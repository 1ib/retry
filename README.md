# retry

A TypeScript utility for retrying sync/async methods that throw errors.

Basic usage:

```ts
import { retry } from "@1ib/retry"

class {
  // Use the `retry` decorator to retry a method if it throws an error,
  // for a maximum of 3 tries.
  @retry(3)
  foo() {
    // This method can return anything or throw an error.
  }
}
```

For `async` methods:

```ts
class {
  // Same as before, but an async function, which means it returns a Promise.
  // It also retries up to 3 times if an error is thrown.
  @retry(3)
  async foo() {
    // This method can return anything or throw an error.
  }
}
```

For custom retry logic:

```ts
import fs from "fs/promises"

class {
    // This method retries up to 3 times if an error is thrown,
    // and only if the error is an `ENOENT` or `ENFILE` error.
    @retry(async ({ code }: Result | Error, attempts: number) =>
        (code === "ENFILE" || code === "EMFILE") && attempts < 3)
    async foo() {
        return fs.readFile("README.md", "utf8")
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


## License

This project is licensed under the MIT.

## Author

[kingcc](https://github.com/kingcc)
