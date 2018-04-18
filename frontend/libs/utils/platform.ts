/**
 * Various platform helpers to determine which api is being used or target platfom
 */
export function isApiRc(url: string) {
  return url.indexOf('api-rc') > -1;
}

export function isApiBeta(url: string) {
  return url.indexOf('api-beta') > -1;
}

export function isApiProd(url: string) {
  return url.indexOf('api-prod') > -1;
}

/**
 * Mobile helpers
 */

declare var NSObject, NSString, android, java;

/**
 * Determine if running on native iOS mobile app
 */
export function isIOS() {
  return typeof NSObject !== 'undefined' && typeof NSString !== 'undefined';
}

/**
 * Determine if running on native Android mobile app
 */
export function isAndroid() {
  return typeof android !== 'undefined' && typeof java !== 'undefined';
}

/**
 * Determine if running on native iOS or Android mobile app
 */
export function isNativeScript() {
  return isIOS() || isAndroid();
}

/**
 * mobile web browsers
 * credit to:
 */
export const isWebMobile = {
  getUserAgent: () => {
    return typeof window !== 'undefined' ? window.navigator.userAgent : '';
  },
  Android: function() {
    return /Android/i.test(isWebMobile.getUserAgent()) && !isWebMobile.Windows();
  },
  BlackBerry: function() {
    return /BlackBerry|BB10|PlayBook/i.test(isWebMobile.getUserAgent());
  },
  iPhone: function() {
    return /iPhone/i.test(isWebMobile.getUserAgent()) && !isWebMobile.iPad() && !isWebMobile.Windows();
  },
  iPod: function() {
    return /iPod/i.test(isWebMobile.getUserAgent());
  },
  iPad: function() {
    return /iPad/i.test(isWebMobile.getUserAgent());
  },
  iOS: function() {
    return isWebMobile.iPad() || isWebMobile.iPod() || isWebMobile.iPhone();
  },
  Opera: function() {
    return /Opera Mini/i.test(isWebMobile.getUserAgent());
  },
  Windows: function() {
    return /Windows Phone|IEMobile|WPDesktop/i.test(isWebMobile.getUserAgent());
  },
  KindleFire: function() {
    return /Kindle Fire|Silk|KFAPWA|KFSOWI|KFJWA|KFJWI|KFAPWI|KFAPWI|KFOT|KFTT|KFTHWI|KFTHWA|KFASWI|KFTBWI|KFMEWI|KFFOWI|KFSAWA|KFSAWI|KFARWI/i.test(
      isWebMobile.getUserAgent()
    );
  },
  any: function() {
    return (
      isWebMobile.Android() ||
      isWebMobile.BlackBerry() ||
      isWebMobile.iOS() ||
      isWebMobile.Opera() ||
      isWebMobile.Windows()
    );
  }
};
