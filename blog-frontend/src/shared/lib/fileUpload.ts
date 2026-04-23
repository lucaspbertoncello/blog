export function buildFileUploadFormData(fields: Record<string, string>, file: File) {
  const formData = new FormData();

  Object.entries(fields).forEach(([fieldName, fieldValue]) => {
    formData.append(fieldName, fieldValue);
  });
  formData.append("file", file);

  return formData;
}

export function buildUploadedFileUrl(url: string, key: string) {
  return `${url.replace(/\/$/, "")}/${key}`;
}

export function validateUploadFileType<TFileType extends string>(
  file: File,
  allowedTypes: readonly TFileType[],
  errorMessage: string,
): asserts file is File & { type: TFileType } {
  if (!allowedTypes.includes(file.type as TFileType)) {
    throw new Error(errorMessage);
  }
}

export function validateUploadFileSize(
  file: File,
  params: { minSizeInBytes?: number; maxSizeInBytes?: number },
) {
  const { minSizeInBytes = 1, maxSizeInBytes } = params;

  if (file.size < minSizeInBytes) {
    throw new Error("Arquivo nao pode estar vazio");
  }

  if (maxSizeInBytes !== undefined && file.size > maxSizeInBytes) {
    throw new Error(`Arquivo deve ter no maximo ${Math.floor(maxSizeInBytes / (1024 * 1024))}MB`);
  }
}
