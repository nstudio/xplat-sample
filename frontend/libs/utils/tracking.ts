export interface ICategories {
  ARTIST: string;
  VIEWER: string;
  USERS: string;
  DIALOGS: string;
  APP_VERSION: string;
  BUTTONS: string;
  PURCHASES: string;
  ERRORS: string;
}

export interface IActions {
  LOGIN: string;
  DIALOG_OPEN: string;
  SET_USER_PROPERTIES_USER: string;
  SET_USER_PROPERTIES_SESSION: string;
  ARTIST_ADD_PAGE: string; // just clicking add page button
  ARTIST_ADDED_PAGE: string; // actually added a page (must be logged in to do so)
  ARTIST_MARK_COMPLETE: string;
  ARTIST_LIVESTREAM: string;
  VIEWER_SHOWLOVE: string;
  PURCHASE_ARTISTTAG1: string;
  PURCHASE_DONATION1: string;
  PURCHASE_DONATION2: string;
  ERROR_ARTIST_FAILEDUPLOAD: string;
  ERROR_LOW_MEMORY: string;
  ERROR_UNCAUGHT_EXCEPTION: string;
}

export class Tracking {
  public static Categories: ICategories = {
    ARTIST: 'Artist',
    VIEWER: 'Viewer',
    USERS: 'Users',
    DIALOGS: 'Dialogs',
    APP_VERSION: 'App Version',
    BUTTONS: 'Buttons',
    PURCHASES: 'Purchases',
    ERRORS: 'Errors'
  };

  public static Actions: IActions = {
    LOGIN: 'login',
    DIALOG_OPEN: 'dialog_open',
    ERROR_LOW_MEMORY: 'error_low_memory',
    ERROR_UNCAUGHT_EXCEPTION: 'error_uncaught_exception',
    ARTIST_ADD_PAGE: 'artist_add_page',
    ARTIST_ADDED_PAGE: 'artist_added_page',
    ARTIST_MARK_COMPLETE: 'artist_mark_complete',
    ARTIST_LIVESTREAM: 'artist_livestream',
    ERROR_ARTIST_FAILEDUPLOAD: 'artist_failed_upload',
    VIEWER_SHOWLOVE: 'viewer_showlove',
    PURCHASE_ARTISTTAG1: 'purchase_artisttag1',
    PURCHASE_DONATION1: 'purchase_donation1',
    PURCHASE_DONATION2: 'purchase_donation2',
    SET_USER_PROPERTIES_USER: 'set_user_properties_user',
    SET_USER_PROPERTIES_SESSION: 'set_user_properties_session'
  };
}
