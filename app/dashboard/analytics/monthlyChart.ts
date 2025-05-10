import { betweenDates } from "./betweenDates";

export const monthlyChart = (chartItems: { date: Date; total: number }[]) => {
  return [
    {
      date: "3 weeks ago",
      revenue: chartItems
        .filter((order) => betweenDates(order.date, 21, 28))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "2 weeks ago",
      revenue: chartItems
        .filter((order) => betweenDates(order.date, 14, 21))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "1 weeks ago",
      revenue: chartItems
        .filter((order) => betweenDates(order.date, 7, 14))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "this week",
      revenue: chartItems
        .filter((order) => betweenDates(order.date, 0, 7))
        .reduce((acc, order) => acc + order.total, 0),
    },
  ];
};
