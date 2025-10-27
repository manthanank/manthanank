export const getCurrentWeekRange = () => {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;
  const last = first + 6;

  const firstDay = new Date(today.setDate(first));
  const lastDay = new Date(today.setDate(last));

  return {
    start: firstDay.toISOString().split("T")[0],
    end: lastDay.toISOString().split("T")[0],
  };
};
