export type Log = {
    version: string;
    date: Date;
    description: string;
};

export const changelog: Log[] = [
    {
        version: "1.0.0",
        date: new Date(1732244789000),
        description: "Created the first version of EZMLA."
    },
    {
        version: "1.0.1",
        date: new Date("2025-04-17"),
        description: "Fixed the copy button not copying."
    }
];
