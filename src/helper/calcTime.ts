interface unitsInterface {
    [key: string]: number;
}

export const calcTime = (
  value: number,
  unit: "second" | "minute" | "hour" | "day"
): number => {
  const units: unitsInterface = {
    second: 1, // 1 second
    minute: 60, // 1 minute
    hour: 3600, // 1 hour
    day: 86400  // 1 day
  };

  if (!units[unit]) {
    throw new Error("Invalid time unit");
  }

  return value * units[unit] * 1000;
};