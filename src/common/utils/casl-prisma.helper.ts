export function createPrismaSelect<T>(
  allowedFields: string[],
): Record<string, boolean> {
  return allowedFields.reduce(
    (acc, field) => {
      acc[field] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );
}
