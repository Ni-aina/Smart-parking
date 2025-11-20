export const getDateFormat = (date: Date) => {
    return date.toLocaleDateString([], {
        dateStyle: "medium",
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}

export const getTimeFormat = (date: Date) => {
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

export const addHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setHours(date.getHours() + hours)
    return newDate;
}