export const calcTotalPrice = (peopleCount, petCount, numberOfNights) => {
  const basePrice = 150;
  const additionalPricePerDay = 100;
  const additionalPricePerPerson = 15;
  const additionalPricePerPet = 10;

  if (numberOfNights === 0) {
    return 0;
  }

  let totalPrice;

  if (numberOfNights < 7) {
    totalPrice = basePrice + additionalPricePerDay * (numberOfNights - 1);
  } else {
    totalPrice = 650 + additionalPricePerDay * (numberOfNights - 7);
  }

  if (peopleCount > 4) {
    totalPrice += additionalPricePerPerson * (peopleCount - 4) * numberOfNights;
  }

  totalPrice += additionalPricePerPet * petCount;

  return totalPrice;
};
