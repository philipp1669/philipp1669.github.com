import { WebUntis } from "https://cdn.skypack.dev/webuntis@latest";

// Function to format time
let formatTime = (date) => {
  date = WebUntis.convertUntisTime(date);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  return `${hours}:${minutes}`;
};

// Function to fetch timetable from WebUntis
let stundenplanJson = async (
  schulname,
  benutzername,
  passwort,
  domain,
  date
) => {
  const untis = new WebUntis(schulname, benutzername, passwort, domain);

  await untis.login();
  let timetable = await untis.getOwnTimetableFor(date);

  await untis.logout();
  timetable.sort((a, b) => a.startTime - b.startTime);

  let json = {
    date: date,
    timetable: [],
  };

  timetable.forEach((lesson) => {
    if (lesson.code === "cancelled") return;
    const startTime = `${formatTime(lesson.startTime)}`;
    const endTime = `${formatTime(lesson.endTime)}`;

    const room = lesson.ro[0]?.name || "Raum unbekannt";

    json.timetable.push({
      startTimeFormatted: startTime,
      endTimeFormatted: endTime,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      subject_long: lesson.su[0]?.longname || "Fach unbekannt",
      subject_brief: lesson.su[0]?.name || "Fach unbekannt",
      room: room,
    });
  });

  return json;
};

export default stundenplanJson;
