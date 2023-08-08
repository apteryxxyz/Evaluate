export interface Translations {
  [key: string]: Translations | string;
}

export type ParameterType =
  | 'Date'
  | 'number'
  | 'string'
  | `${string} | ${string}`;

export type Parameter = [key: string, type: ParameterType];

export interface Parsed {
  key: string;
  value: string;
  parameters: Parameter[];
}

export interface Layer {
  [key: string]: Layer | Parsed;
}
