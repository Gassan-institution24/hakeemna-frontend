const formatDate = (date) => {
  console.log('date', date);
  return new Date(date)
    .toISOString()
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/\.\d{3}/, '');
};
export async function addToCalendar(event) {
  try {
    const startTime = encodeURIComponent(formatDate(event.start_time));
    const endTime = encodeURIComponent(formatDate(event.end_time));
    const title = encodeURIComponent(`appointment at ${event.unit_service?.name_english}`);
    const location = encodeURIComponent(
      event.unit_service?.location_gps || event.unit_service?.address
    );

    // const appleUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startTime}\nDTEND:${endTime}\nSUMMARY:${title}\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startTime}/${endTime}&text=${title}&location=${location}`;

    // const isAppleDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    // if (isAppleDevice) {
    //   // const addToAppleCalendar = confirm('Would you like to add to Apple Calendar?');
    //   // if (addToAppleCalendar) {
    //   await window.open(appleUrl, '_blank');
    //   // } else {
    //   // const addToGoogleCalendar = confirm('Would you like to add to Google Calendar?');
    //   // if (addToGoogleCalendar) {
    //   redirectToGoogleCalendar(googleUrl);
    //   // }
    //   // }
    // } else {
    // const addToGoogleCalendar = confirm('Would you like to add to Google Calendar?');
    // if (addToGoogleCalendar) {
    redirectToGoogleCalendar(googleUrl);
    // }
    // }
  } catch (e) {
    console.error(e);
  }
}

function redirectToGoogleCalendar(url) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, '_blank');
  }
}
