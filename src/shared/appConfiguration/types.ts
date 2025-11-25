type AppInfo = {
  VERSION: string;
};

type SupportInfo = {
  MAIL: string;
  BODY: string;
  SUBJECT: string;
  ESO_URL: string;
  PHONE_NUMBER: string;
};

type ExtURLsType = {
  PRODUCT_DOCS: string;
};

type AppConfigType = {
  APP: AppInfo;
  SUPPORT: SupportInfo;
  EXT_URLS: ExtURLsType;
};


export type {
  AppConfigType,
};
