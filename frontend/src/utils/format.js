// src/utils/format.js

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0";
  return amount.toLocaleString() + " so'm";
};

const DAY_NAMES = {
  0: "Yak",
  1: "Du",
  2: "Se",
  3: "Chor",
  4: "Pay",
  5: "Ju",
  6: "Sha",
};

export const formatDays = (days) => {
  if (!days) return null;
  return days
    .split(",")
    .map((d) => DAY_NAMES[d.trim()] || d)
    .join(", ");
};
