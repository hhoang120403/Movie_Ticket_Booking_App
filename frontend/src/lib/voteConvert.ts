export const voteConvert = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm';
  } else {
    return `${num}`;
  }
};
