import prodEnvironment from "./environment.prod.ts";
import devEnvironment from "./environment.dev.ts";

const environments = {
  production: prodEnvironment,
  development: devEnvironment,
};

const mode = import.meta.env.MODE as keyof typeof environments;
export const environment = environments[mode] || devEnvironment;
