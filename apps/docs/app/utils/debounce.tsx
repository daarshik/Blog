export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear the previous timeout if still active
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
