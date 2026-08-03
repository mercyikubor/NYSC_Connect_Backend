export const parseCallUpLetter = (text) => {
  const callUpNumberMatch = text.match(/NYSC\/[A-Z]+\/\d{4}\/\d+/i);
  return {
    callUpNumber: callUpNumberMatch ? callUpNumberMatch[0] : null,
  };
};
