export type IncludeFromPaths<Paths extends string> =
  Paths extends `${infer First}.${infer Rest}`
    ? { [K in First]: { include: IncludeFromPaths<Rest> } }
    : { [K in Paths]: true };
export type MergeIncludes<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? B[K]
    : K extends keyof A
      ? A[K]
      : never;
};

export type IncludesFromArray<Arr extends readonly string[]> = Arr extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? MergeIncludes<IncludeFromPaths<First>, IncludesFromArray<Rest>>
  : {};
