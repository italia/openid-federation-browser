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
): Promise<boolean> => {
  const valid = await entityConfigurationValidator(ec);
  return valid;
};

export const validateSubordinateStatement = async (
  sub: object,
): Promise<boolean> => {
  console.error(avj.errorsText(subordinateStatementValidator.errors));
  return subordinateStatementValidator(sub);
};
