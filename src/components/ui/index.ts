/**
 * UI Components Module
 *
 * Centralized exports for all UI components following Atomic Design principles.
 * Components are organized by complexity: Atoms → Molecules → Organisms → Templates.
 *
 * @module components/ui
 *
 * @remarks
 * Component hierarchy:
 * - **Atoms**: Basic building blocks from shadcn/ui (buttons, inputs, cards, etc.)
 * - **Molecules**: Simple composite components combining 2-3 atoms
 * - **Organisms**: Complex sections combining multiple molecules
 * - **Templates**: Page-level layout components
 *
 * @example
 * ```typescript
 * // Import atoms
 * import { Button, Card, Input } from '@/components/ui';
 *
 * // Import molecules
 * import { ProjectCard, SearchInput } from '@/components/ui';
 *
 * // Import organisms
 * import { Header, Footer, ProjectGrid } from '@/components/ui';
 *
 * // Import templates
 * import { Container, Section } from '@/components/ui';
 * ```
 */

/**
 * Atomic Design Level: Atoms
 * Basic shadcn/ui primitives - the foundational building blocks.
 */
export * from './atoms'

/**
 * Atomic Design Level: Molecules
 * Simple composite components built from 2-3 atoms.
 */
export { Button } from './molecules/Button'
export { Badge } from './molecules/Badge'
export { ProjectCard } from './molecules/ProjectCard'
export { ProjectCardSkeleton } from './molecules/ProjectCardSkeleton'
export { SearchInput } from './molecules/SearchInput'
export { AboutCard } from './molecules/AboutCard'
export { SectionHeader } from './molecules/SectionHeader'

/**
 * Atomic Design Level: Organisms
 * Complex composite sections combining multiple molecules and atoms.
 */
export { HeroSection } from './organisms/HeroSection'
export { ProjectModal } from './organisms/ProjectModal'
export { Dropdown } from './organisms/Dropdown'
export { ControlsBar } from './organisms/ControlsBar'
export { PageHeader } from './organisms/PageHeader'
export { ProjectGrid } from './organisms/ProjectGrid'
export { TimelineItem } from './organisms/TimelineItem'
export { Header } from './organisms/Header'
export { Footer } from './organisms/Footer'
export { default as BackgroundAnimation } from './organisms/BackgroundAnimation'

/**
 * Atomic Design Level: Templates
 * Page-level layout components that define content structure.
 */
export { Container } from '../templates/Container'
export { Section } from '../templates/Section'
export { ResultsInfo } from '../templates/ResultsInfo'
