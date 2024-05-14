import assert from "node:assert"
import { describe, mock, test, Mock } from "node:test"
import { retry } from "./retry"

describe("sync method", () => {
    test("should retry twice", () => {
        class Test {
            attempts = 0

            @retry(2)
            thirdTimeWillWork() {
                if (this.attempts++ < 2) {
                    throw new Error()
                }
                return this.attempts
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
        assert.strictEqual(result, 3)
    })

    test("should fail", () => {
        class Test {
            attempts = 0

            @retry(1)
            thirdTimeWillWork() {
                if (this.attempts++ < 2) {
                    throw new Error()
                }
                return this.attempts
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
            attempts = 0

            @retry(2)
            async thirdTimeWillWork() {
                if (this.attempts++ < 2) {
                    throw new Error()
                }
                return this.attempts
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
        assert.strictEqual(result, 3)
    })

    test("should fail", async () => {
        class Test {
            attempts = 0

            @retry(1)
            async thirdTimeWillWork() {
                if (this.attempts++ < 2) {
                    throw new Error()
                }
                return this.attempts
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
            attempts = 0

            @retry<() => { needRetry: boolean }>(
                (result) => "needRetry" in result && result.needRetry,
            )
            async thirdTimeWillWork() {
                if (this.attempts++ < 2) {
                    return {
                        attempts: this.attempts,
                        needRetry: true,
                    }
                }
                return {
                    attempts: this.attempts,
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
        assert.deepEqual(await test.thirdTimeWillWork(), { attempts: 3 })
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })

    test("should use async check callback", async () => {
        class Test {
            attempts = 0

            @retry<() => { needRetry: boolean }>(
                async (result) => "needRetry" in result && result.needRetry,
            )
            thirdTimeWillWork() {
                if (this.attempts++ < 2) {
                    return {
                        attempts: this.attempts,
                        needRetry: true,
                    }
                }
                return {
                    attempts: this.attempts,
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
        assert.deepEqual(await test.thirdTimeWillWork(), { attempts: 3 })
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })

    test("should use async check callback and fail", async () => {
        class Test {
            attempts = 0

            @retry<() => { needRetry: boolean }>(
                async (result, attempts) =>
                    "needRetry" in result && result.needRetry && attempts <= 1,
            )
            thirdTimeWillWork() {
                if (this.attempts++ < 2) {
                    return {
                        attempts: this.attempts,
                        needRetry: true,
                    }
                }
                return {
                    attempts: this.attempts,
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
            attempts: 2,
            needRetry: true,
        })
        assert.strictEqual(
            (test.thirdTimeWillWork as Mock<typeof test.thirdTimeWillWork>).mock
                .calls.length,
            1,
        )
    })
})
