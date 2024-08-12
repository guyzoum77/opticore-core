/**
 * Give time like: 6-8-2024 4:30:29
 */


export const dateTimeFormattedUtils: string = `${(new Date().getMonth())}-${(new Date().getDate())}-${(new Date().getFullYear())} ${(new Date().getHours())}:${(new Date().getMinutes())}:${(new Date().getSeconds())}`;