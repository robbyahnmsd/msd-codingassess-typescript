import { People, PeopleFactory, BirthingUnit } from "../CodeToRefactor";

describe("People class", () => {
  test("constructor throws on empty name", () => {
    expect(() => new People("")).toThrow("Name must be a non-empty string.");
  });

  test("constructor throws on invalid dob", () => {
    expect(() => new People("Alice", "not a date" as any)).toThrow("Invalid date of birth.");
  });

  test("age calculation is correct", () => {
    const sixteenYearsAgo = new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000);
    const p = new People("Test", sixteenYearsAgo);
    expect(p.age).toBeGreaterThanOrEqual(16);
  });

  test("nameWithDOB returns formatted string", () => {
    const dob = new Date("2000-01-01");
    const p = new People("John", dob);
    expect(p.nameWithDOB).toBe("John (2000-01-01)");
  });
});

describe("PeopleFactory", () => {
  test("createRandomPerson returns People with valid name and DOB", () => {
    const person = PeopleFactory.createRandomPerson();
    expect(["Bob", "Betty"]).toContain(person.name);
    expect(person.dob).toBeInstanceOf(Date);
  });

  test("createRandomPeople returns array of correct length", () => {
    const people = PeopleFactory.createRandomPeople(3);
    expect(people.length).toBe(3);
    people.forEach(p => expect(p).toBeInstanceOf(People));
  });

  test("createRandomPeople throws on negative count", () => {
    expect(() => PeopleFactory.createRandomPeople(-1)).toThrow("Count must be non-negative.");
  });
});

describe("BirthingUnit", () => {
  let unit: BirthingUnit;

  beforeEach(() => {
    unit = new BirthingUnit();
  });

  test("addPeople throws if argument is not array", () => {
    expect(() => unit.addPeople(null as any)).toThrow("Input must be an array of People objects.");
  });

  test("addPeople stores people and getAllPeople returns them", () => {
    const people = PeopleFactory.createRandomPeople(2);
    unit.addPeople(people);
    const allPeople = unit.getAllPeople();
    expect(allPeople).toHaveLength(2);
    expect(allPeople).toEqual(expect.arrayContaining(people));
  });

  test("getAllPeople returns a copy, not the internal array", () => {
    const people = PeopleFactory.createRandomPeople(1);
    unit.addPeople(people);
    const allPeople = unit.getAllPeople();
    allPeople.push(new People("Extra"));
    expect(unit.getAllPeople()).toHaveLength(1); // original unchanged
  });

  test("findBobs filters correctly by name and age", () => {
    const bobYoung = new People("Bob", new Date(Date.now() - 25 * 365 * 24 * 60 * 60 * 1000)); // 25 years old
    const bobOld = new People("Bob", new Date(Date.now() - 35 * 365 * 24 * 60 * 60 * 1000));   // 35 years old
    const betty = new People("Betty", new Date(Date.now() - 40 * 365 * 24 * 60 * 60 * 1000));  // 40 years old

    unit.addPeople([bobYoung, bobOld, betty]);

    expect(unit.findBobs()).toEqual(expect.arrayContaining([bobYoung, bobOld]));
    expect(unit.findBobs(true)).toEqual(expect.arrayContaining([bobOld]));
    expect(unit.findBobs(true)).not.toContain(bobYoung);
  });

  test("getMarriedName returns full name correctly", () => {
    const person = new People("Alice");
    expect(unit.getMarriedName(person, "Smith")).toBe("Alice Smith");
  });

  test("getMarriedName returns original name if lastName contains 'test'", () => {
    const person = new People("Alice");
    expect(unit.getMarriedName(person, "TestLastName")).toBe("Alice");
    expect(unit.getMarriedName(person, "myTestName")).toBe("Alice");
  });

  test("getMarriedName truncates if full name is too long", () => {
    const person = new People("A".repeat(250));
    const longLastName = "B".repeat(50);
    const fullName = unit.getMarriedName(person, longLastName);
    expect(fullName.length).toBeLessThanOrEqual(255);
  });

  test("getMarriedName throws on invalid input", () => {
    expect(() => unit.getMarriedName({} as any, "Smith")).toThrow("Invalid person object.");
    expect(() => unit.getMarriedName(new People("Alice"), "")).toThrow("Last name must be a non-empty string.");
  });
});
