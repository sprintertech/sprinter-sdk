export function getEnv(envName: string, defaultValue: string): string {
  let variable: string | undefined;
  try {
    if (typeof process !== "undefined" && "env" in process)
      variable = process.env[envName];
    else if ("env" in import.meta) {
      const env =
        // @ts-expect-error
        (import.meta.env as { [key: string]: string | undefined }) || {};
      variable = env[envName];
    }
  } finally {
    variable ??= defaultValue;
  }
  return variable;
}
