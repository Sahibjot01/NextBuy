import { checkDates } from "./checkDates";

export const weeklyChart = (chartItems: { date: Date; total: number }[]) => {
  return [
    {
      date: "6d ago",
      revenue: chartItems
        .filter((order) => checkDates(order.date, 6))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "5d ago",
      revenue: chartItems
        .filter((order) => checkDates(order.date, 5))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "4d ago",
      revenue: chartItems
        .filter((order) => checkDates(order.date, 4))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "3d ago",
      revenue: chartItems
        .filter((order) => checkDates(order.date, 3))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "2d ago",
      revenue: chartItems
        .filter((order) => checkDates(order.date, 2))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "1d ago",
      revenue: chartItems
        .filter((order) => checkDates(order.date, 1))
        .reduce((acc, order) => acc + order.total, 0),
    },
    {
      date: "today",
      revenue: chartItems
        .filter((order) => checkDates(order.date, 0))
        .reduce((acc, order) => acc + order.total, 0),
    },
  ];
};
