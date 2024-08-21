import { useTranslate } from "src/locales";

const formatDate = (date) =>
  new Date(date)
    .toISOString()
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/\.\d{3}/, '');

export async function addToCalendar(event) {
// eslint-disable-next-line
  const { t } = useTranslate()
  try {
    const startTime = encodeURIComponent(formatDate(event.start_time));
    const endTime = encodeURIComponent(formatDate(event.end_time));
    const title = encodeURIComponent(`appointment at ${event.unit_service?.name_english}`);
    const location = encodeURIComponent(
      event.unit_service?.location_gps || event.unit_service?.address
    );

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startTime}/${endTime}&text=${title}&location=${location}`;

    // eslint-disable-next-line no-restricted-globals
    const addToGoogleCalendar = confirm(t('Would you like to add this event to your Google Calendar?'));

    if (addToGoogleCalendar) {
      redirectToGoogleCalendar(googleUrl);
    }
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
