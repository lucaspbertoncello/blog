import { ApplicationError } from "../ApplicationError";

export function dynamoErrorMapper(err: unknown): ApplicationError {
  if (err instanceof Error) {
    switch (err.name) {
      case "ConditionalCheckFailedException":
        return new ApplicationError("Operação não permitida: condição não satisfeita");

      case "TransactionConflictException":
        return new ApplicationError("Conflito ao processar a operação. Tente novamente");

      case "ProvisionedThroughputExceededException":
      case "RequestLimitExceeded":
      case "ThrottlingException":
        return new ApplicationError("Muitas requisições. Tente novamente mais tarde");

      case "ResourceNotFoundException":
        return new ApplicationError("Recurso não encontrado");

      case "ItemCollectionSizeLimitExceededException":
        return new ApplicationError("Limite de tamanho excedido");

      case "ValidationException":
        return new ApplicationError("Dados inválidos");
    }
  }

  return new ApplicationError("Erro interno");
}
