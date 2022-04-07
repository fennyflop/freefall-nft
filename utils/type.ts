type TMintData = {
    max: number;
    remaining: number;
}

export type TMintContext = {
    mintData: TMintData;
    countdownDate: Date | undefined;
    setMintData: (value: any) => void;
    setCountdownDate: (value: any) => void;
}