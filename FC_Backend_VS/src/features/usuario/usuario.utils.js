export const normalizarEmail = (email) =>
  String(email ?? "").trim().toLowerCase();

export const ehHashBcrypt = (hash) =>
  /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash ?? "");
