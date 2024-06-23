"use client";

// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { FC } from "react";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

type MyResponsiveBarProps = {
    data: BarChartData[];
};

export const MyResponsiveBar: FC<MyResponsiveBarProps> = ({ data }) => (
    <ResponsiveBar
        data={data}
        keys={["Current Period", "Previou Period"]}
        indexBy="emotion"
        margin={{ top: 20, right: 10, bottom: 55, left: 55 }}
        padding={0.3}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        // // colors={{ scheme: "nivo" }}
        colors={["#fbbf24", "#4ade80"]}
        borderRadius={5}
        borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        // // axisRight={{
        // //     tickSize: 5,
        // //     tickPadding: 5,
        // //     tickRotation: 0,
        // //     legend: "food",
        // //     legendPosition: "middle",
        // //     legendOffset: 40,
        // //     truncateTickAt: 0,
        // // }}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: "country",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Score",
            legendPosition: "middle",
            legendOffset: -50,
            truncateTickAt: 0,
        }}
        enableGridY={true}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="white"
        // // labelTextColor={{
        // //     from: "color",
        // //     modifiers: [["brighter", 3]],
        // // }}
        legends={[
            {
                dataFrom: "keys",
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 55,
                itemsSpacing: 2,
                itemWidth: 120,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 16,
                symbolShape: "circle",
                effects: [
                    {
                        on: "hover",
                        style: {
                            itemTextColor: "#000",
                        },
                    },
                ],
            },
        ]}
        // role="application"
        // ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
            e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
        theme={{
            axis: {
                legend: {
                    text: {
                        fontSize: 12,
                        fontWeight: 600,
                        fill: "#4b5563",
                    },
                },
                ticks: {
                    text: {
                        fontSize: 12,
                        fontWeight: 500,
                        fill: "#4b5563",
                    },
                },
            },
            legends: {
                text: {
                    fontSize: 12,
                    fontWeight: 600,
                    // fill: "#4b5563",
                },
            },
        }}
    />
);
