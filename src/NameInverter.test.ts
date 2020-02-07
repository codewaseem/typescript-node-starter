import nameInverter from "./nameInverter";

describe("nameInverter", () => {
  test("given empty string returns empty string", () => {
    assertInverted("", "");
  });

  test("given simple name returns simple name", () => {
    assertInverted("bob", "bob");
  });

  test("given first last, returns last, first", () => {
    assertInverted("bob martin", "martin, bob");
  });

  test("given name with spaces around, should return name without spaces around", () => {
    assertInverted("  bob", "bob");
  });

  test("given first and last with extra space in middle, should return last first without extra spaces", () => {
    assertInverted("  bob  martin  ", "martin, bob");
  });

  test("should ignore honorifcs like Mr., Mrs., etc", () => {
    assertInverted(" Mr. Bob Martin ", "Martin, Bob");
    assertInverted(" Mrs. Bob", "Bob");
    assertInverted("Mrs. Hajira Ahmed", "Ahmed, Hajira");
  });

  test("should include postnominals at last", () => {
    assertInverted("Bob Martin Sr.", "Martin, Bob Sr.");
    assertInverted(" Bob  Martin Jr. ", "Martin, Bob Jr.");
    assertInverted(
      " Mr.  Waseem   Ahmed   B.Tech,  M.Tech, Ph.D",
      "Ahmed, Waseem B.Tech, M.Tech, Ph.D"
    );
  });

  function assertInverted(originalName: string, invertedName: string) {
    expect(nameInverter(originalName)).toBe(invertedName);
  }
});
