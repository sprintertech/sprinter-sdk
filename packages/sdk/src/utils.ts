export function getEnv(envName: string, defaultValue: string): string {
  let variable: string;
  try {
    if (typeof process !== "undefined" && "env" in process)
      variable = process.env[envName];
    else if ("env" in import.meta) {
      // @ts-expect-error
      const env = import.meta.env as { [key: string]: string | undefined } || {};
      variable = env[envName];
    }
  } finally {
    variable ??= defaultValue;
  }
  return variable;
}
