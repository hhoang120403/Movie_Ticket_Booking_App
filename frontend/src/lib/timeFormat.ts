export const timeFormat = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const minutesRemainder = minutes % 60;
  if (hours < 1) return `${minutesRemainder}m`;
  return `${hours}h ${minutesRemainder}m`;
};

export const isoTimeFormat = (dateTime: string) => {
  const date = new Date(dateTime);
  const localTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return localTime;
};

export const dateFormat = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};
