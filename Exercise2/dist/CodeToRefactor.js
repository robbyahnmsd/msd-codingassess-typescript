"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirthingUnit = exports.People = void 0;
class People {
    constructor(name, dob) {
        this.name = name;
        this.dob = dob || People.Under16;
    }
    getName() {
        return this.name;
    }
    getDOB() {
        return this.dob;
    }
}
exports.People = People;
People.Under16 = new Date(Date.now() - (15 * 365 * 24 * 60 * 60 * 1000));
class BirthingUnit {
    constructor() {
        this._people = [];
    }
    /**
     * GetPeoples
     * @param j
     * @returns List<object>
     */
    getPeople(i) {
        for (let j = 0; j < i; j++) {
            try {
                // Creates a dandon Name
                let name = "";
                const random = Math.random();
                if (Math.floor(random * 2) === 0) {
                    name = "Bob";
                }
                else {
                    name = "Betty";
                }
                // Adds new people to the list
                const age = Math.floor(Math.random() * (85 - 18) + 18) * 356;
                const birthDate = new Date(Date.now() - (age * 24 * 60 * 60 * 1000));
                this._people.push(new People(name, birthDate));
            }
            catch (e) {
                // Dont think this should ever happen
                throw new Error("Something failed in user creation");
            }
        }
        return this._people;
    }
    getBobs(olderThan30) {
        const thirtyYearsAgo = new Date(Date.now() - (30 * 356 * 24 * 60 * 60 * 1000));
        return olderThan30
            ? this._people.filter(x => x.name === "Bob" && x.dob >= thirtyYearsAgo)
            : this._people.filter(x => x.name === "Bob");
    }
    getMarried(p, lastName) {
        if (lastName.includes("test"))
            return p.name;
        if ((p.name.length + lastName).length > 255) {
            (p.name + " " + lastName).substring(0, 255);
        }
        return p.name + " " + lastName;
    }
}
exports.BirthingUnit = BirthingUnit;
//# sourceMappingURL=CodeToRefactor.js.map