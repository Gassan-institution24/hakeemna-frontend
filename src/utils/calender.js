import moment from 'moment-timezone';

const formatDate = (date, timezone) =>
  moment(date).tz(timezone).format('YYYYMMDDTHHmmss[Z]').replace(/[TZ]/g, '');

export function AddToIPhoneCalendar(event) {
  const startTime = encodeURIComponent(formatDate(new Date(event.start_time)));
  const endTime = encodeURIComponent(formatDate(new Date(event.end_time)));
  const title = encodeURIComponent(`appointment at ${event.unit_service?.name_english}`);
  const location = encodeURIComponent(
    event.unit_service?.location_gps || event.unit_service?.address
  );
  const url = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startTime}\nDTEND:${endTime}\nSUMMARY:${title}\nLOCATION:${location}\nEND:VEVENT\nEND:VCALENDAR`;

  window.open(url);
}

export function AddToGoogleCalendar(event) {
  const startTime = encodeURIComponent(formatDate(new Date(event.start_time)));
  const endTime = encodeURIComponent(formatDate(new Date(event.end_time)));
  const title = encodeURIComponent(`appointment at ${event.unit_service?.name_english}`);
  const location = encodeURIComponent(
    event.unit_service?.location_gps || event.unit_service?.address
  );

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startTime}/${endTime}&text=${title}&location=${location}`;

  const element = document.createElement('a');
  element.href = url;
  element.setAttribute('download', 'event.ics');
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
