const DEFAULT_LOCALE = "es-MX";
export const SOURCE_TIME_ZONE = "America/Mexico_City";

const mapPartsToObject = (parts) =>
  parts.reduce((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

const getTimeZoneOffset = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = mapPartsToObject(formatter.formatToParts(date));
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return asUtc - date.getTime();
};

const zonedTimeToDate = (
  dateString,
  timeString,
  sourceTimeZone = SOURCE_TIME_ZONE
) => {
  if (!dateString || !timeString) {
    return null;
  }

  const [year, month, day] = String(dateString)
    .split("-")
    .map((chunk) => Number(chunk.trim()));
  const [hours = 0, minutes = 0, seconds = 0] = String(timeString)
    .split(":")
    .map((chunk) => Number(chunk.trim()));

  if (
    [year, month, day, hours, minutes, seconds].some((value) =>
      Number.isNaN(value)
    )
  ) {
    return null;
  }

  const utcCandidate = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds)
  );
  if (Number.isNaN(utcCandidate.getTime())) {
    return null;
  }

  const offset = getTimeZoneOffset(utcCandidate, sourceTimeZone);
  return new Date(utcCandidate.getTime() - offset);
};

export const formatTimeInUserZone = (
  dateString,
  timeString,
  {
    includeZone = false,
    locale = DEFAULT_LOCALE,
    sourceTimeZone = SOURCE_TIME_ZONE,
  } = {}
) => {
  const date = zonedTimeToDate(dateString, timeString, sourceTimeZone);
  if (!date) {
    return "";
  }

  const userTimeZone = getUserTimeZone();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: userTimeZone,
  };

  if (includeZone) {
    options.timeZoneName = "short";
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const getUserTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
