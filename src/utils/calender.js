const formatDate = (date) => {
  console.log('date', date);
  return new Date(date)
    .toISOString()
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/\.\d{3}/, '');
};

export async function AddToIPhoneCalendar(event) {
  try {
    const startTime = encodeURIComponent(formatDate(event.start_time));
    const endTime = encodeURIComponent(formatDate(event.end_time));
    const title = encodeURIComponent(`appointment at ${event.unit_service?.name_english}`);
    const location = encodeURIComponent(
      event.unit_service?.location_gps || event.unit_service?.address
    );
    const url = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startTime}\nDTEND:${endTime}\nSUMMARY:${title}\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;
    await window.open(url, '_blank');
  } catch (e) {
    console.error(e);
  }
}

export async function AddToGoogleCalendar(event) {
  try {
    const startTime = encodeURIComponent(formatDate(event.start_time));
    const endTime = encodeURIComponent(formatDate(event.end_time));
    const title = encodeURIComponent(`appointment at ${event.unit_service?.name_english}`);
    const location = encodeURIComponent(
      event.unit_service?.location_gps || event.unit_service?.address
    );

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startTime}/${endTime}&text=${title}&location=${location}`;

    // Detect if the user is using a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // If on mobile, open the link in the current tab
      window.location.href = url;
    } else {
      // If not on mobile, open the link in a new tab
      await window.open(url, '_blank');
    }
  } catch (e) {
    console.error(e);
  }
}
