// Design System Tokens for Gulf Coast Charters
export const colors = {
  primary: {
    gradient: 'from-blue-600 to-cyan-600',
    solid: 'bg-blue-600',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-700'
  },
  secondary: {
    gradient: 'from-cyan-500 to-blue-500',
    solid: 'bg-cyan-600',
    text: 'text-cyan-600'
  }
};

export const shadows = {
  card: 'shadow-lg',
  cardHover: 'hover:shadow-xl',
  button: 'shadow-md'
};

export const spacing = {
  section: 'py-12 md:py-16',
  container: 'container mx-auto px-4',
  cardGap: 'gap-4 md:gap-6'
};

export const typography = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
  h3: 'text-2xl md:text-3xl font-bold',
  body: 'text-base md:text-lg',
  small: 'text-sm'
};

export const breakpoints = {
  mobile: 'grid-cols-1',
  tablet: 'sm:grid-cols-2',
  desktop: 'lg:grid-cols-3',
  wide: 'xl:grid-cols-4'
};
