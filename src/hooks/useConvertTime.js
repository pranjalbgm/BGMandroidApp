const ConvertTime = time24 => {
  // Parse the input time
  const time = time24.split(':');
  let hours = parseInt(time[0], 10);
  const minutes = parseInt(time[1], 10);

  // Determine the period (AM or PM)
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // If hours is 0, set it to 12 (Midnight or Noon)

  // Format the result
  let time12 = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

  return time12;
};

export default ConvertTime;

export function separateDateAndTime(dateTimeString) {
  if (dateTimeString && dateTimeString.length > 5) {
    let datePart, timePart;

    // Handle case where the date-time string includes 'T'
    if (dateTimeString.includes('T')) {
      [datePart, timePart] = dateTimeString.split('T');
    } else {
      // Assuming the format is 'YYYY-MM-DD HH:MM:SS' if not 'T' is present
      [datePart, timePart] = dateTimeString.split(' ');
    }

    const [year, month, day] = datePart.split('-');

    // Format the date into 'DD-MM-YYYY' (1-based month)
    const formattedDate = `${day}-${parseInt(month, 10)}-${year}`;

    return {date: formattedDate, time: timePart};
  }

  // Return null or empty object for malformed input
  return {date: null, time: null};
}
