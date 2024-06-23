import { startOfDay, subDays, endOfDay } from "date-fns";

export const processData = (rawData: any[], filter: string) => {
    // Perform your heavy computations here

    let currentPeriod = new Date();
    let previousPeriod = subDays(currentPeriod, 1);

    const previousPeriodData = filterDataByDate(rawData, previousPeriod);
    const currentPeriodData = filterDataByDate(rawData, currentPeriod);

    const { prevAvgSorted, curAvgSorted } = getSortedAvgData(
        previousPeriodData,
        currentPeriodData,
        2,
    );

    console.log(curAvgSorted);

    const cardData = getCardsData(prevAvgSorted, curAvgSorted);
    const barData = getBarData(prevAvgSorted, curAvgSorted, 10, filter);

    return {
        cardData,
        barData,
    };
};

const filterDataByDate = (data: any[], date: Date) => {
    const targetDate = startOfDay(date);
    // const targetDate = subDays(targetDate_, 1);

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

const getCardsData = (prevAvg: any, curAvg: any) => {
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

    const changesSorted = Object.fromEntries(
        Object.entries(changes).sort(([, a], [, b]) => b - a),
    );

    const curAvgEntries = Object.entries(curAvg);
    const [firstCurAvg, secondCurAvg] = curAvgEntries;

    // Get the first and last k,v in changesSorted
    const changesEntries = Object.entries(changesSorted);
    const firstChange = changesEntries[0];
    const lastChange = changesEntries[changesEntries.length - 1];

    cardData.set("main_1", {
        title: firstCurAvg[0],
        value: roundDecimal(firstCurAvg[1] as number),
        change: roundDecimal(changesSorted[firstCurAvg[0]]),
    });

    cardData.set("main_2", {
        title: secondCurAvg[0],
        value: roundDecimal(secondCurAvg[1] as number),
        change: roundDecimal(changesSorted[secondCurAvg[0]]),
    });

    cardData.set("change_1", {
        title: firstChange[0],
        value: roundDecimal(curAvg[firstChange[0]]),
        change: roundDecimal(firstChange[1]),
    });

    cardData.set("change_2", {
        title: lastChange[0],
        value: roundDecimal(curAvg[lastChange[0]]),
        change: roundDecimal(lastChange[1]),
    });

    return cardData;
};

const getBarData = (
    prevAvg: { [key: string]: number },
    curAvg: { [key: string]: number },
    topN: number,
    filter: string,
) => {
    // Get first N of curAvg data
    const curAvgEntries = Object.entries(curAvg);
    const curAvgTopN = curAvgEntries.slice(0, topN);

    // Determine the labels based on the filter
    let currentPeriodLabel = "Current Period";
    let previousPeriodLabel = "Previous Period";

    if (filter === "days") {
        currentPeriodLabel = "Today";
        previousPeriodLabel = "Yesterday";
    } else if (filter === "weeks") {
        currentPeriodLabel = "This month";
        previousPeriodLabel = "Last month";
    }

    // Map through curAvgTopN to create the desired schema
    const barData = curAvgTopN.map(([emotion, currentPeriodValue]) => {
        const prevPeriodValue =
            prevAvg[emotion] !== undefined ? prevAvg[emotion] : 0;
        return {
            emotion,
            [currentPeriodLabel]: roundDecimal(currentPeriodValue), // Ensure this is a number
            [previousPeriodLabel]: roundDecimal(prevPeriodValue), // Ensure this is a number
        };
    });

    return barData;
};

const getSortedAvgData = (prevData: any, curData: any, topN: number) => {
    const prevAvg = averages(prevData);
    const curAvg = averages(curData);

    const prevAvgSorted = Object.fromEntries(
        Object.entries(prevAvg).sort(([, a], [, b]) => b - a),
    );

    const curAvgSorted = Object.fromEntries(
        Object.entries(curAvg).sort(([, a], [, b]) => b - a),
    );

    return { prevAvgSorted, curAvgSorted };
};

const roundDecimal = function (num: number) {
    if (num > 100 || num < -100) {
        return Math.round(num);
    } else if (num > 10 || num < -10) {
        return Math.round(num * 10) / 10;
    } else {
        return Math.round(num * 100) / 100;
    }
};
