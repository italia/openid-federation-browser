import Ajv from "ajv";
import entityConfiguration from "./schemas/entityConfiguration.schema.json";
import subordinateStatement from "./schemas/subordinateStatement.schema.json";

const avj = new Ajv({
  logger: console,
  allErrors: true,
  verbose: true,
});

const entityConfigurationValidator = avj.compile(entityConfiguration);
const subordinateStatementValidator = avj.compile(subordinateStatement);

export const validateEntityConfiguration = async (
  ec: object,
): Promise<[boolean, string | undefined]> => {
  const valid = await entityConfigurationValidator(ec);

  if (valid) {
    return [true, undefined];
  }

  return [false, avj.errorsText(entityConfigurationValidator.errors)];
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
