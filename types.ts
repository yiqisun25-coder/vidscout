export type FormatId = 'cloud' | 'qa' | 'bts';

export interface FormatField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

export interface ScriptFormat {
  id: FormatId;
  label: string;
  tag: string;
  desc: string;
  color: string;
  fields: FormatField[];
}
