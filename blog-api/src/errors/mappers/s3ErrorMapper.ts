import { ApplicationError } from "../ApplicationError";

export function s3ErrorMapper(err: unknown): ApplicationError {
  if (err instanceof Error) {
    switch (err.name) {
      case "NoSuchBucket":
        return new ApplicationError("Bucket de armazenamento não encontrado");

      case "NoSuchKey":
        return new ApplicationError("Arquivo não encontrado");

      case "AccessDenied":
        return new ApplicationError("Acesso negado ao armazenamento");

      case "EntityTooLarge":
        return new ApplicationError("Arquivo excede o tamanho máximo permitido");

      case "EntityTooSmall":
        return new ApplicationError("Arquivo abaixo do tamanho mínimo permitido");

      case "InvalidStorageClass":
        return new ApplicationError("Classe de armazenamento inválida");

      case "SlowDown":
      case "RequestThrottled":
        return new ApplicationError("Muitas requisições. Tente novamente mais tarde");

      case "ServiceUnavailable":
        return new ApplicationError("Serviço de armazenamento indisponível. Tente novamente mais tarde");
    }
  }

  return new ApplicationError("Erro interno");
}
