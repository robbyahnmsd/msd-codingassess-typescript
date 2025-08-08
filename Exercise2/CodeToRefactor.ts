// ============================
// Domain Constants
// ============================

// Number of days in a year (non-leap, for simplicity)
const DAYS_IN_YEAR = 365;

// Number of milliseconds in a day
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Minimum legal age for certain domain operations (e.g., registration)
const MIN_LEGAL_AGE = 16;

// Minimum and maximum random ages when generating test data
const MIN_RANDOM_AGE = 18;
const MAX_RANDOM_AGE = 85;

// Maximum allowed length for a full name
const MAX_NAME_LENGTH = 255;

// Default pool of names used for generating random people
const DEFAULT_NAMES = ["Bob", "Betty"];

/**
 * Converts a number of years into milliseconds.
 * This is used for date calculations such as DOB generation and age thresholds.
 * @param years Number of years to convert
 * @returns Milliseconds equivalent of the given years
 */
function yearsToMilliseconds(years: number): number {
    return years * DAYS_IN_YEAR * MS_PER_DAY;
}

/**
 * Represents a person with a name and date of birth.
 * Immutable once created.
 */
class People {
    // Default DOB is set to exactly MIN_LEGAL_AGE years ago from now.
    public static readonly DefaultDOB: Date =
        new Date(Date.now() - yearsToMilliseconds(MIN_LEGAL_AGE));

    /**
     * @param name Full name of the person (non-empty)
     * @param dob Date of birth (defaults to DefaultDOB if not provided)
     */
    constructor(
        public readonly name: string,
        public readonly dob: Date = People.DefaultDOB
    ) {
        // Validate name
        if (!name || name.trim().length === 0) {
            throw new Error("Name must be a non-empty string.");
        }
        // Validate DOB is a proper Date
        if (!(dob instanceof Date) || isNaN(dob.getTime())) {
            throw new Error("Invalid date of birth.");
        }
    }

    /**
     * Returns the person's name along with their DOB in YYYY-MM-DD format.
     * Example: "Bob (1990-05-12)"
     */
    public get nameWithDOB(): string {
        return `${this.name} (${this.dob.toISOString().split("T")[0]})`;
    }

    /**
     * Calculates the current age in whole years.
     */
    public get age(): number {
        const diffMs = Date.now() - this.dob.getTime();
        return Math.floor(diffMs / MS_PER_DAY / DAYS_IN_YEAR);
    }
}

/**
 * Factory class for generating People instances.
 * Useful for testing and seeding data.
 */
class PeopleFactory {
    /**
     * Creates a single random person with:
     * - A random name from DEFAULT_NAMES
     * - A random age between MIN_RANDOM_AGE and MAX_RANDOM_AGE
     */
    static createRandomPerson(): People {
        const name = DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)] as string;
        const age = Math.floor(Math.random() * (MAX_RANDOM_AGE - MIN_RANDOM_AGE + 1)) + MIN_RANDOM_AGE;
        const dob = new Date(Date.now() - yearsToMilliseconds(age));
        return new People(name, dob);
    }

    /**
     * Creates an array of random people.
     * @param count Number of people to generate (must be non-negative)
     */
    static createRandomPeople(count: number): People[] {
        if (count < 0) throw new Error("Count must be non-negative.");
        return Array.from({ length: count }, () => this.createRandomPerson());
    }
}

/**
 * Represents a collection of people with operations for adding, searching, and modifying names.
 */
class BirthingUnit {
    private people: People[] = [];

    /**
     * Adds multiple people to the unit.
     * @param newPeople Array of People objects
     */
    public addPeople(newPeople: People[]): void {
        if (!Array.isArray(newPeople)) throw new Error("Input must be an array of People objects.");
        this.people.push(...newPeople);
    }

    /**
     * Retrieves all stored people.
     * Returns a copy to avoid accidental external mutation.
     */
    public getAllPeople(): People[] {
        return [...this.people];
    }

    /**
     * Finds all "Bob" entries, optionally filtering for those older than 30 years.
     * @param olderThan30 If true, only include people at least 30 years old
     */
    public findBobs(olderThan30: boolean = false): People[] {
        const cutoffDate = new Date(Date.now() - yearsToMilliseconds(30));
        return this.people.filter(person =>
            person.name === "Bob" &&
            (!olderThan30 || person.dob <= cutoffDate)
        );
    }

    /**
     * Generates a married name for a given person and last name.
     * - If last name contains "test" (case-insensitive), returns original name
     * - If result exceeds MAX_NAME_LENGTH, it is truncated
     * @param person The person getting married
     * @param lastName The last name to append
     */
    public getMarriedName(person: People, lastName: string): string {
        if (!(person instanceof People)) throw new Error("Invalid person object.");
        if (typeof lastName !== "string" || lastName.trim().length === 0) {
            throw new Error("Last name must be a non-empty string.");
        }
        if (lastName.toLowerCase().includes("test")) {
            return person.name;
        }

        const fullName = `${person.name} ${lastName}`;
        return fullName.length > MAX_NAME_LENGTH
            ? fullName.substring(0, MAX_NAME_LENGTH)
            : fullName;
    }
}

// ============================
// Example usage
// ============================
const unit = new BirthingUnit();
unit.addPeople(PeopleFactory.createRandomPeople(5));

console.log(unit.getAllPeople().map(p => p.nameWithDOB)); // List all with DOB
console.log(unit.findBobs(true)); // Find Bobs older than 30

export { People, PeopleFactory, BirthingUnit };