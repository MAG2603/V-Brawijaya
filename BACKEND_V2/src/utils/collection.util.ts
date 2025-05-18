export const generateIdentifier = (): string => {
  const year = new Date().getFullYear();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KOL-${year}-${randomStr}`;
};
