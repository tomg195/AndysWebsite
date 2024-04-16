export const calcTotalPrice = (peopleCount, petCount, numberOfDays) => {
  const basePrice = 150;
  const additionalPricePerDay = 100;
  const additionalPricePerPersonUpTp7Days = 100;
  const additionalPricePerPersonAfter7Days = 15;

  if (numberOfDays === 0) {
    return 0;
  }

  let totalPrice;

  if (numberOfDays < 7) {
    totalPrice = basePrice + additionalPricePerDay * (numberOfDays - 1);
  } else {
    totalPrice = 650 + additionalPricePerDay * (numberOfDays - 7);
  }

  if (peopleCount > 4) {
    if (numberOfDays <= 7) {
      totalPrice += additionalPricePerPersonUpTp7Days * (peopleCount - 4);
    } else {
      const additionalDaysAfter7 = numberOfDays - 7;
      totalPrice +=
        additionalPricePerPersonAfter7Days *
        (peopleCount - 4) *
        additionalDaysAfter7;
      // Here, after 7 days, the additional cost per person is 15 PER DAY
    }
  }

  return totalPrice;
};
