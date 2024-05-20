import assert from "node:assert"
import { describe, mock, test, Mock } from "node:test"
import { retry, attempts } from "@/main"

describe("sync method", () => {
    test("should retry twice", () => {
        class Test {
            @retry(2)
            thirdTimeWillWork(@attempts attempts?: number) {
                if (attempts! < 2) {
                    throw new Error()
                }
                return attempts
            }
        }

        const test = new Test()
        mock.method(test, "thirdTimeWillWork")

        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            0,
        )
        const result = test.thirdTimeWillWork()
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
        assert.strictEqual(result, 2)
    })

    test("should fail", () => {
      class Test {
        @retry(1)
        thirdTimeWillWork(@attempts attempts?: number) {
            if (attempts! < 2) {
                throw new Error()
            }
            return attempts
        }
    }

        const test = new Test()
        mock.method(test, "thirdTimeWillWork")

        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            0,
        )
        assert.throws(test.thirdTimeWillWork, Error)
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })
})

describe("async method", () => {
    test("should retry twice", async () => {
      class Test {
        @retry(2)
        thirdTimeWillWork(@attempts attempts?: number) {
            if (attempts! < 2) {
                throw new Error()
            }
            return attempts
        }
    }

        const test = new Test()
        mock.method(test, "thirdTimeWillWork")

        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            0,
        )
        const result = await test.thirdTimeWillWork()
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
        assert.strictEqual(result, 2)
    })

    test("should fail", async () => {
      class Test {
        @retry(1)
       async thirdTimeWillWork(@attempts attempts?: number) {
            if (attempts! < 2) {
                throw new Error()
            }
            return attempts
        }
    }

        const test = new Test()
        mock.method(test, "thirdTimeWillWork")

        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            0,
        )
        assert.rejects(test.thirdTimeWillWork, Error)
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })

    test("should use check callback", async () => {
        class Test {
            @retry<() => { needRetry: boolean }>(
                (result) => "needRetry" in result && result.needRetry,
            )
            async thirdTimeWillWork(@attempts attempts?: number) {
                if (attempts! < 2) {
                    return {
                        attempts,
                        needRetry: true,
                    }
                }
                return {
                    attempts,
                }
            }
        }

        const test = new Test()
        mock.method(test, "thirdTimeWillWork")

        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            0,
        )
        assert.deepEqual(await test.thirdTimeWillWork(), { attempts: 2 })
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })

    test("should use async check callback", async () => {
        class Test {
            @retry<() => { needRetry: boolean }>(async (result) => {
                return "needRetry" in result && result.needRetry
            })
            thirdTimeWillWork(@attempts attempts?: number) {
                if (attempts! < 2) {
                    return {
                        attempts,
                        needRetry: true,
                    }
                }
                return {
                    attempts,
                }
            }
        }

        const test = new Test()
        mock.method(test, "thirdTimeWillWork")

        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            0,
        )
        assert.deepEqual(await test.thirdTimeWillWork(), { attempts: 2 })
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })

    test("should use async check callback and fail", async () => {
        class Test {
            @retry<() => { needRetry: boolean }>(
                async (result, attempts) =>
                    "needRetry" in result && result.needRetry && attempts < 2,
            )
            thirdTimeWillWork(@attempts attempts?: number) {
                if (attempts! < 2) {
                    return {
                        attempts,
                        needRetry: true,
                    }
                }
                return {
                    attempts,
                }
            }
        }

        const test = new Test()
        mock.method(test, "thirdTimeWillWork")

        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            0,
        )
        assert.deepEqual(await test.thirdTimeWillWork(), {
            attempts: 1,
            needRetry: true,
        })
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })
})