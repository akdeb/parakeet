import { startOfDay, subDays, endOfDay } from "date-fns";

export const processData = (rawData: any[], filter: string) => {
    // Perform your heavy computations here
    // Example: Transform raw data into the format required by the chart

    let currentPeriod = new Date();
    let previousPeriod = subDays(currentPeriod, 1);

    const currentPeriodData = filterDataByDate(rawData, currentPeriod);
    const previousPeriodData = filterDataByDate(rawData, previousPeriod);

    const cardData = getCardsData(previousPeriodData, currentPeriodData, 2);

    // return card data, line data, pie data and bar data
    return {
        cardData,
    };
};

const filterDataByDate = (data: any[], date: Date) => {
    const targetDate_ = startOfDay(date);
    const targetDate = subDays(targetDate_, 1);

    return data.filter((item) => {
        const createdAt = new Date(item.created_at);
        const createdDate = startOfDay(createdAt);
        return (
            createdDate.getTime() === targetDate.getTime() &&
            item.role === "user"
        );
    });
};

const averages = (data: any[]) => {
    const scoresSum: { [key: string]: number } = {};
    const averages: { [key: string]: number } = {};

    data.forEach((item) => {
        if (item.metadata && item.metadata.scores) {
            for (const [key, value] of Object.entries(item.metadata.scores)) {
                if (scoresSum[key]) {
                    scoresSum[key] += value as number;
                } else {
                    scoresSum[key] = value as number;
                }
            }
        }
    });

    for (const [key, value] of Object.entries(scoresSum)) {
        averages[key] = value / data.length;
    }

    return scoresSum;
};

const getCardsData = (prevData: any, curData: any, topN: number) => {
    const prevAvg = averages(prevData);
    const curAvg = averages(curData);
    const changes: { [key: string]: number } = {};

    const cardData = new Map<
        string,
        { title: string; value: number; change: number }
    >();

    for (const key of Object.keys(curAvg)) {
        if (prevAvg[key] !== undefined) {
            const change = ((curAvg[key] - prevAvg[key]) / prevAvg[key]) * 100;
            changes[key] = change;
        }
    }

    const curAvgSorted = Object.fromEntries(
        Object.entries(curAvg).sort(([, a], [, b]) => b - a),
    );

    const changesSorted = Object.fromEntries(
        Object.entries(changes).sort(([, a], [, b]) => b - a),
    );

    const curAvgEntries = Object.entries(curAvgSorted);
    const [firstCurAvg, secondCurAvg] = curAvgEntries;

    // Get the first and last k,v in changesSorted
    const changesEntries = Object.entries(changesSorted);
    const firstChange = changesEntries[0];
    const lastChange = changesEntries[changesEntries.length - 1];

    cardData.set("main_1", {
        title: firstCurAvg[0],
        value: round2decimal(firstCurAvg[1]),
        change: round2decimal(changesSorted[firstCurAvg[0]]),
    });

    cardData.set("main_2", {
        title: secondCurAvg[0],
        value: round2decimal(secondCurAvg[1]),
        change: round2decimal(changesSorted[secondCurAvg[0]]),
    });

    cardData.set("change_1", {
        title: firstChange[0],
        value: round2decimal(curAvgSorted[firstChange[0]]),
        change: round2decimal(firstChange[1]),
    });

    cardData.set("change_2", {
        title: lastChange[0],
        value: round2decimal(curAvgSorted[lastChange[0]]),
        change: round2decimal(lastChange[1]),
    });

    return cardData;
};

const round2decimal = function (num: number) {
    return Math.round(num * 100) / 100;
};
