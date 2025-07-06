export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/'/g, '')             // remove apostrophes
    .replace(/[^a-z0-9\s-]/g, '')  // remove special characters
    .trim()
    .replace(/\s+/g, '-')          // replace spaces with hyphens
    .replace(/-+/g, '-');          // collapse multiple hyphens
