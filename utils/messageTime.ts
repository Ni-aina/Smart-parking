import { TFunction } from "i18next";

export const shouldShowMessageTime = (
    currentCreatedAt: string,
    previousCreatedAt?: string
) => {
    if (!previousCreatedAt) return true;

    const current = new Date(currentCreatedAt).getTime();
    const previous = new Date(previousCreatedAt).getTime();

    if (Number.isNaN(current) || Number.isNaN(previous)) return true;

    return current - previous > 1000 * 60 * 15;
}

export const formatMessageTime = (date: string, locale: string) => {
    return new Date(date).toLocaleString(locale, {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    })
}

export const formatRelativeMessageTime = (date: string, t: TFunction) => {
    const time = new Date(date).getTime();
    if (Number.isNaN(time)) return "";

    const diffMs = Date.now() - time;
    const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return t("time_now");
    if (diffMinutes === 1) return t("time_minute_ago");
    if (diffMinutes < 60) return t("time_minutes_ago", { count: diffMinutes });
    if (diffHours === 1) return t("time_hour_ago");
    if (diffHours < 24) return t("time_hours_ago", { count: diffHours });
    if (diffDays === 1) return t("time_day_ago");
    if (diffDays < 7) return t("time_days_ago", { count: diffDays });

    return new Date(date).toLocaleDateString([], {
        month: "short",
        day: "2-digit"
    })
}
