import formatPrice from "../lib/formatPrice";

describe("formatPrice", () => {
  it("formats numbers as USD currency", () => {
    expect(formatPrice(12.5)).toBe("$12.50");
    expect(formatPrice(0)).toBe("$0.00");
  });
});
