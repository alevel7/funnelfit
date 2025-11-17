export interface GoogleProfile {
  id: string;
  displayName: string;
  name: { familyName: string; givenName: string };
  emails: [{ value: string; verified: boolean }];
  photos: { value: string }[];
  provider: 'google';
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: true;
  };
}

export interface GoogleLoginMetaData {
  accountType: 'SME' | 'CFO';
  redirect_url: string;
}
