export const isTimeNotPassed = (receivedTime: string) => {
  // Get the current time
  const currentTime = new Date();

  // Parse the received time string
  const receivedTimeParts = receivedTime.split(':');
  const receivedHour = parseInt(receivedTimeParts[0], 10);
  const receivedMinute = parseInt(receivedTimeParts[1], 10);
  const receivedSecond = parseInt(receivedTimeParts[2], 10);

  // Set the received time date object with the current date
  const receivedTimeDate = new Date();
  receivedTimeDate.setHours(receivedHour, receivedMinute, receivedSecond, 0);

  // Compare the current time with the received time
  return currentTime < receivedTimeDate;
};

export function getTodayDate() {
  const today = new Date();
  let month = String(today.getMonth() + 1);
  let day = String(today.getDate());
  const year = today.getFullYear();

  // Add leading zero if month or day is a single digit
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}
