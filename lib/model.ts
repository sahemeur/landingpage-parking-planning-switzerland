export interface UiOrtschaft {
  id: number;
  name: string;
  plz: string;
  favorite: boolean;
}

export interface UiLink {
  id: number;
  name: string;
  url: string;
  gemeinde_id: number;
}

export interface UiFirma {
  id: number;
  name: string;
  strasse: string;
  postfach: string;
  plz: string;
  ort: string;
  mail: string;
  webpage: string;
  plannerlink?: string;
  sprache: string;
}

export interface UiGemeinde {
  id: number;
  name: string;
  kanton_id: string;
  ortschaften: UiOrtschaft[];
  links: UiLink[];
}

export interface UiKanton {
  id: string;
  name_de: string;
  name_fr: string;
  name_it: string;
  gemeinden: UiGemeinde[];
}
