export function capitalize(string): string {
  // being defensize here since some edge cases have arised around it's usage
  if (string) {
    const firstChar = string.charAt(0);
    if (firstChar) {
      return firstChar.toUpperCase() + string.slice(1);
    } else {
      return string;
    }
  }
  return '';
}

export function safeSplit(text: string, splitBy: any) {
  if (text) {
    try {
      if (typeof text === 'string') {
        return text.split(splitBy);
      }
    } catch (err) {
      return ['']; // if for some reason gets here, return empty string split
    }
  }
  // text is null or undefined, just pass back empty array
  return [];
}

export function fileNameFromPath(filePath: string) {
  let filename = '';
  if (filePath) {
    const fileParts = safeSplit(filePath, '/');
    if (fileParts && fileParts.length) {
      filename = fileParts[fileParts.length - 1];
    }
  }
  return filename;
}

export function timecodeDisplay(seconds: number): string {
  let hr: any = Math.floor(seconds / 3600);
  let min: any = Math.floor((seconds - hr * 3600) / 60);
  let sec: any = Math.floor(seconds - hr * 3600 - min * 60);
  if (hr < 10) {
    hr = '0' + hr;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (sec < 10) {
    sec = '0' + sec;
  }
  return (hr === '00' ? '' : hr + ':') + (min + ':' + sec);
}
