/**
 * Design System - Semantic Color Tokens
 *
 * This file exports semantic color class names that should be used
 * throughout the application instead of hardcoded colors.
 *
 * Colors are defined in globals.css using CSS variables with HSL values
 * for better theme support and consistency.
 */

export const designTokens = {
  // Background colors
  background: "bg-background",
  card: "bg-card",
  popover: "bg-popover",

  // Foreground/text colors
  foreground: "text-foreground",
  cardForeground: "text-card-foreground",
  popoverForeground: "text-popover-foreground",

  // Primary colors (neon green)
  primary: "bg-primary text-primary-foreground",
  primaryText: "text-primary",
  primaryHover: "hover:bg-primary/90",

  // Secondary colors
  secondary: "bg-secondary text-secondary-foreground",
  secondaryText: "text-secondary-foreground",
  secondaryHover: "hover:bg-secondary/80",

  // Muted colors
  muted: "bg-muted text-muted-foreground",
  mutedText: "text-muted-foreground",

  // Accent colors (brighter neon green)
  accent: "bg-accent text-accent-foreground",
  accentText: "text-accent",
  accentHover: "hover:bg-accent/90",

  // Destructive/error colors
  destructive: "bg-destructive text-destructive-foreground",
  destructiveText: "text-destructive",
  destructiveHover: "hover:bg-destructive/90",

  // Border and input
  border: "border-border",
  input: "border-input",
  ring: "ring-ring focus:ring-ring",

  // Common combinations
  cardBorder: "border-border",
  inputFocus: "focus:ring-ring focus:border-ring",
} as const;
