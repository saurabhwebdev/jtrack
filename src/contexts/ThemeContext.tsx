import { createContext, useContext, useState, useEffect } from 'react'

type FontSize = 'sm' | 'md' | 'lg'

interface ThemeContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

const ThemeContext = createContext<ThemeContextType>({
  fontSize: 'md',
  setFontSize: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('jtrack-font-size')
    return (saved as FontSize) || 'md'
  })

  useEffect(() => {
    localStorage.setItem('jtrack-font-size', fontSize)
    document.documentElement.style.fontSize = {
      sm: '14px',
      md: '16px',
      lg: '18px'
    }[fontSize]
  }, [fontSize])

  return (
    <ThemeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  )
} 