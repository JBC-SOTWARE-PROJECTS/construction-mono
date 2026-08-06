import { useEffect, useState } from "react"

const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  // Create the debounced function
  const debouncedFunc = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    const id = setTimeout(() => func(...args), delay)
    setTimer(id)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timer])

  return debouncedFunc as T
}

export default useDebounce
