export type NonNullableFields<TObject> = {
  [TKey in keyof TObject]: Exclude<TObject[TKey], null>;
};
