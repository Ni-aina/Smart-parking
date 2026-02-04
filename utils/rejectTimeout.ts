import i18n from "i18next";

export const rejectTimeout = (ms = 1000 * 30, message?: string):
  Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message ?? i18n.t("request_took_too_long")));
    }, ms)
  })
}