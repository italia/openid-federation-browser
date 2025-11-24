import Ajv from "ajv";
import addFormats from "ajv-formats";
import entityConfiguration from "./schemas/entityConfiguration.schema.json";
import subordinateStatement from "./schemas/subordinateStatement.schema.json";
import headerTrustMark from "./schemas/headerTrustMark.schema.json";
import trustMark from "./schemas/trustMark.schema.json";

const avj = new Ajv({
  logger: console,
  allErrors: true,
  verbose: true,
});

addFormats(avj);

const entityConfigurationValidator = avj.compile(entityConfiguration);
const subordinateStatementValidator = avj.compile(subordinateStatement);
const headerTrustMarkValidator = avj.compile(headerTrustMark);
const trustMarkValidator = avj.compile(trustMark);

export const validateEntityConfiguration = async (
  ec: object,
): Promise<[boolean, string | undefined]> => {
  const valid = await entityConfigurationValidator(ec);

  if (valid) {
    return [true, undefined];
  }

  return [false, avj.errorsText(entityConfigurationValidator.errors)];
};

export const validateHeaderTrustMark = async (
  tm: object,
): Promise<[boolean, string | undefined]> => {
  const valid = await headerTrustMarkValidator(tm);

  if (valid) {
    return [true, undefined];
  }

  return [false, avj.errorsText(headerTrustMarkValidator.errors)];
};

export const validateTrustMark = async (
  tm: object,
): Promise<[boolean, string | undefined]> => {
  const valid = await trustMarkValidator(tm);

  if (valid) {
    return [true, undefined];
  }

  return [false, avj.errorsText(trustMarkValidator.errors)];
};


export const validateSubordinateStatement = async (
  sub: object,
): Promise<[boolean, string | undefined]> => {
  const valid = await subordinateStatementValidator(sub);

  if (valid) {
    return [true, undefined];
  }

  return [false, avj.errorsText(subordinateStatementValidator.errors)];
};
