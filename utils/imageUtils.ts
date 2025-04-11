// Funkcja generująca obrazy-placeholdery
export function getPlaceholderImage(
  width: number,
  height: number,
  text: string = 'Blog',
): string {
  return `https://placehold.co/${width}x${height}/E0E0E0/808080?text=${text.replace(
    /\s+/g,
    '+',
  )}`;
}

// Funkcja generująca placeholdery awatarów
export function getAvatarPlaceholder(name: string): string {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return `https://placehold.co/100x100/4F46E5/FFFFFF?text=${initials}`;
}
