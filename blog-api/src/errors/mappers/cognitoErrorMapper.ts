import { ApplicationError } from "../ApplicationError";

export function cognitoErrorMapper(err: unknown): ApplicationError {
  if (err instanceof Error) {
    switch (err.name) {
      // confirmCode
      case "CodeMismatchException":
        return new ApplicationError("Código inválido");
      case "ExpiredCodeException":
        return new ApplicationError("Código expirado");
      case "AliasExistsException":
        return new ApplicationError("E-mail já está em uso por outra conta");

      // signup
      case "UsernameExistsException":
        return new ApplicationError("E-mail já cadastrado");
      case "InvalidPasswordException":
        return new ApplicationError("Senha não atende aos requisitos mínimos");
      case "InvalidParameterException":
        return new ApplicationError("Parâmetros inválidos");

      // signin
      case "UserNotConfirmedException":
        return new ApplicationError("Conta ainda não confirmada. Verifique seu e-mail");
      case "PasswordResetRequiredException":
        return new ApplicationError("Redefinição de senha necessária");

      // compartilhados
      case "UserNotFoundException":
        return new ApplicationError("Usuário não encontrado");
      case "NotAuthorizedException":
        return new ApplicationError("E-mail ou senha incorretos");
      case "TooManyRequestsException":
        return new ApplicationError("Muitas tentativas. Tente novamente mais tarde");
      case "TooManyFailedAttemptsException":
        return new ApplicationError("Muitas tentativas incorretas. Tente novamente mais tarde");
    }
  }
  return new ApplicationError("Erro interno");
}
