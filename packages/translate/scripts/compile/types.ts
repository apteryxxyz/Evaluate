/**
 * Represents a full, unparsed, translation file object. The keys are
 * the translation keys while the values can either be a string or
 * another object with more keys.
 */
export interface UnparsedTranslations {
  [key: string]: UnparsedTranslations | string;
}

/**
 * A tuple that represents a parameter in a translation string. The
 * first value is the parameter name while the second value is the
 * parameter type.
 */
export type Parameter = [
  name: string,
  type: 'Date' | 'number' | 'string' | `${string} | ${string}`,
];

/**
 * An interface that represents a fully parsed translation string.
 */
export interface Translation {
  /**
   * The translation key.
   */
  key: string;
  /**
   * The original translation string.
   */
  value: string;
  /**
   * The parameters in the translation string.
   */
  parameters: Parameter[];
}

/**
 * Represents a fully parsed translation file object. The keys are
 * the translation keys while the values can either be a string or
 * another object with more keys.
 */
export interface Translations {
  [key: string]: Translations | Translation;
}
