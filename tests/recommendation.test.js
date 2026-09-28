import test from "node:test";
import assert from "node:assert/strict";
import {
  recommend,
  validateRecommendations,
} from "../server/recommendation.js";
import handler from "../api/recommend.js";

test("rejects invented IDs and duplicate recommendations", () => {
  const result = validateRecommendations({
    summary: "Matches",
    recommendations: [
      { productId: "p1", reason: "Affordable" },
      { productId: "fake", reason: "Invented" },
      { productId: "p1", reason: "Duplicate" },
      { productId: "p2", reason: 3 },
    ],
  });
  assert.deepEqual(result.recommendations, [
    { productId: "p1", reason: "Affordable" },
  ]);
});
test("passes preferences and catalog to AI and validates response", async () => {
  const result = await recommend("phone under ₹30000", {
    apiKey: "test-key",
    fetchFn: async (url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.messages[1].content, "phone under ₹30000");
      assert.match(body.messages[0].content, /PixelPeak/);
      assert.equal(body.response_format.type, "json_object");
      assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
      assert.match(body.messages[0].content, /Indian rupees/);
      return {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  summary: "A match",
                  recommendations: [
                    { productId: "p2", reason: "Camera and price fit" },
                  ],
                }),
              },
            },
          ],
        }),
      };
    },
  });
  assert.equal(result.recommendations[0].productId, "p2");
});
test("missing credentials produces a useful configuration error", async () => {
  await assert.rejects(
    recommend("phone", { apiKey: "" }),
    (error) => error.status === 503,
  );
});
test("upstream usage limits are reported", async () => {
  await assert.rejects(
    recommend("phone", {
      apiKey: "test",
      fetchFn: async () => ({ ok: false, status: 429 }),
    }),
    (error) => error.status === 429,
  );
});
test("API rejects invalid preferences and methods before contacting AI", async () => {
  const res = {
    setHeader() {},
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  await handler({ method: "GET" }, res);
  assert.equal(res.code, 405);
  for (const preferences of ["", "ab", "a".repeat(501), 123, null]) {
    await handler({ method: "POST", body: { preferences } }, res);
    assert.equal(res.code, 400);
  }
});
test("empty AI results are preserved", () => {
  assert.deepEqual(
    validateRecommendations({ summary: "No matches", recommendations: [] })
      .recommendations,
    [],
  );
});
