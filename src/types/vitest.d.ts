/**
 * Vitest Global Type Definitions
 *
 * TypeScript declaration file that imports global type definitions for Vitest
 * testing framework and Testing Library matchers.
 *
 * @module types/vitest
 *
 * @remarks
 * This file enables:
 * - Vitest global test functions (describe, it, expect, etc.) without imports
 * - Jest-DOM custom matchers for Testing Library (toBeInTheDocument, etc.)
 *
 * No imports are needed in test files for these globals to be available.
 */

/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
