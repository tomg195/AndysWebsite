const handleDaysSelect = (item) => {
  setRange([item.selection]);
  if (item.selection.startDate && item.selection.endDate) {
    setDaysSelected(true);
  } else {
    setDaysSelected(false);
  }
};
