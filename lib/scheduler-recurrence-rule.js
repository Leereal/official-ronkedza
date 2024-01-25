import schedule from "node-schedule";

const getRecurrenceRule = (recurrence, startDate) => {
  const rule = new schedule.RecurrenceRule();

  switch (recurrence) {
    case "daily":
      rule.hour = startDate.getHours();
      rule.minute = startDate.getMinutes();
      rule.second = startDate.getSeconds();
      rule.tz = startDate.getTimezoneOffset() / 60; // Set the timezone
      rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Repeat every day
      break;
    case "weekly":
      rule.hour = startDate.getHours();
      rule.minute = startDate.getMinutes();
      rule.second = startDate.getSeconds();
      rule.tz = startDate.getTimezoneOffset() / 60; // Set the timezone
      rule.dayOfWeek = [startDate.getDay()]; // Repeat on the same day of the week
      break;
    case "monthly":
      rule.hour = startDate.getHours();
      rule.minute = startDate.getMinutes();
      rule.second = startDate.getSeconds();
      rule.tz = startDate.getTimezoneOffset() / 60; // Set the timezone
      rule.date = startDate.getDate(); // Repeat on the same day of the month
      break;
    default:
      throw new Error(`Unsupported recurrence pattern: ${recurrence}`);
  }

  return rule;
};

export default getRecurrenceRule;
