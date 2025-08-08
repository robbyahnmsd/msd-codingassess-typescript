declare class People {
    private static readonly Under16;
    name: string;
    dob: Date;
    constructor(name: string, dob?: Date);
    getName(): string;
    getDOB(): Date;
}
declare class BirthingUnit {
    /**
     * MaxItemsToRetrieve
     */
    private _people;
    constructor();
    /**
     * GetPeoples
     * @param j
     * @returns List<object>
     */
    getPeople(i: number): People[];
    private getBobs;
    getMarried(p: People, lastName: string): string;
}
export { People, BirthingUnit };
//# sourceMappingURL=CodeToRefactor.d.ts.map