// Accessibility utilities and constants for WCAG 2.1 AA compliance

export const a11y = {
  // Announce content to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.className = 'sr-only'
    announcement.textContent = message
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  },

  // Focus management
  focusTrap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus()
            e.preventDefault()
          }
        }
      }
    })
  },

  // Skip to main content link
  skipToMain: () => {
    const skipLink = document.createElement('a')
    skipLink.href = '#main'
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-sky text-white px-4 py-2 rounded-md'
    skipLink.textContent = 'Skip to main content'
    return skipLink
  }
}

// ARIA labels for interactive elements
export const ariaLabels = {
  navigation: {
    main: 'Main navigation',
    breadcrumb: 'Breadcrumb navigation',
    pagination: 'Pagination navigation'
  },
  buttons: {
    menu: 'Toggle navigation menu',
    close: 'Close',
    filter: 'Filter options',
    search: 'Search',
    play: 'Play video',
    pause: 'Pause video'
  },
  form: {
    required: 'required',
    error: 'Error:',
    success: 'Success:'
  }
}

// Color contrast ratios for WCAG AA
export const colorContrast = {
  // Minimum contrast ratios
  normal: 4.5, // Normal text
  large: 3, // Large text (18pt or 14pt bold)
  
  // Check contrast ratio between two colors
  checkContrast: (color1: string, color2: string): number => {
    // This would need a proper implementation
    // For now, return a placeholder
    return 4.5
  }
}

// Keyboard navigation helpers
export const keyboard = {
  isNavigationKey: (key: string): boolean => {
    return ['Tab', 'Enter', 'Space', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)
  },
  
  handleListNavigation: (event: KeyboardEvent, currentIndex: number, totalItems: number): number => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        return Math.min(currentIndex + 1, totalItems - 1)
      case 'ArrowUp':
        event.preventDefault()
        return Math.max(currentIndex - 1, 0)
      case 'Home':
        event.preventDefault()
        return 0
      case 'End':
        event.preventDefault()
        return totalItems - 1
      default:
        return currentIndex
    }
  }
}

// Screen reader utilities
export const screenReader = {
  // Live region for dynamic content
  liveRegion: (message: string, type: 'polite' | 'assertive' = 'polite') => {
    a11y.announce(message, type)
  },
  
  // Description for complex UI elements
  describeElement: (element: HTMLElement, description: string) => {
    const id = `desc-${Date.now()}`
    const desc = document.createElement('span')
    desc.id = id
    desc.className = 'sr-only'
    desc.textContent = description
    element.appendChild(desc)
    element.setAttribute('aria-describedby', id)
  }
}