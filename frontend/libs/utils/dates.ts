export function diffInMs(date: Date, compareDate?: Date) {
  const today: any = compareDate || new Date();
  const dateMath: any = date;
  return today > date ? today - dateMath : dateMath - today; // milliseconds between now & date
}

export function diffInDays(date: Date, compareDate?: Date) {
  const diffMs = diffInMs(date, compareDate);
  return Math.floor(diffMs / 86400000); // days
}

export function diffInHrs(date: Date, compareDate?: Date) {
  const diffMs = diffInMs(date, compareDate);
  return Math.floor((diffMs % 86400000) / 3600000); // hours
}

// export function diffInMins(date: Date, compareDate?: Date) {
//   const diffMs = diffInMs(date, compareDate);
//   const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
//   console.log('diffMins:', diffMins);
//   return diffMins; // minutes
// }

export function IsDate(p_Expression: any) {
  return !isNaN(<any>new Date(p_Expression)); // <-- review further
}

export function CDate(p_Date) {
  if (IsDate(p_Date)) {
    return new Date(p_Date);
  }

  var strTry = p_Date
    .replace(/\-/g, '/')
    .replace(/\./g, '/')
    .replace(/ /g, '/'); // fix separators
  strTry = strTry.replace(/pm$/i, ' pm').replace(/am$/i, ' am'); // and meridian spacing
  if (IsDate(strTry)) {
    return new Date(strTry);
  }

  var strTryYear = strTry + '/' + new Date().getFullYear(); // append year
  if (IsDate(strTryYear)) {
    return new Date(strTryYear);
  }

  if (strTry.indexOf(':')) {
    // if appears to have time
    var strTryYear2 = strTry.replace(/ /, '/' + new Date().getFullYear() + ' '); // insert year
    if (IsDate(strTryYear2)) {
      return new Date(strTryYear2);
    }

    var strTryDate = new Date().toDateString() + ' ' + p_Date; // pre-pend current date
    if (IsDate(strTryDate)) {
      return new Date(strTryDate);
    }
  }

  return false; // double as looser IsDate
  //throw("Error #13 - Type mismatch");	// or is this better?
}

export function diffInMins(p_Date1, p_Date2?: Date) {
  if (!p_Date2) {
    p_Date2 = new Date();
  }
  const p_Interval = 'n';
  const dt1 = CDate(p_Date1);
  const dt2 = CDate(p_Date2);

  //correct Daylight Savings Ttime (DST)-affected intervals ("d" & bigger)
  if ('h,n,s,ms'.indexOf(p_Interval.toLowerCase()) == -1) {
    if (p_Date1.toString().indexOf(':') == -1) {
      (<Date>dt1).setUTCHours(0, 0, 0, 0);
    } // no time, assume 12am
    if (p_Date2.toString().indexOf(':') == -1) {
      (<Date>dt2).setUTCHours(0, 0, 0, 0);
    } // no time, assume 12am
  }

  // get ms between UTC dates and make into "difference" date
  const iDiffMS: any = <any>dt2.valueOf() - <any>dt1.valueOf();
  const dtDiff = new Date(iDiffMS);

  const nMilliseconds = iDiffMS;
  const nSeconds: any = Math.ceil(parseInt(<string>iDiffMS) / 1000);
  return Math.ceil(parseInt(<string>nSeconds) / 60);
}
