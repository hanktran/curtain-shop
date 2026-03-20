import { describe, expect, it } from 'vitest'

import { projectSchema } from '@/lib/project-schema'

const validProject = {
  title: 'Living Room Remodel',
  slug: 'living-room-remodel',
  description: 'A full redesign with curtains and wallpaper.',
  roomType: 'apartment',
  images: ['https://example.com/project-1.jpg'],
  published: true,
}

describe('projectSchema', () => {
  it('passes validation for valid project data', () => {
    const result = projectSchema.safeParse(validProject)
    expect(result.success).toBe(true)
  })

  it('fails for invalid slug format', () => {
    const result = projectSchema.safeParse({
      ...validProject,
      slug: 'Invalid Slug!',
    })
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'slug')).toBe(true)
    }
  })

  it('fails when required fields are missing', () => {
    const { description: _description, ...missingDescription } = validProject
    const result = projectSchema.safeParse(missingDescription)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'description')).toBe(true)
    }
  })

  it('fails for invalid roomType', () => {
    const result = projectSchema.safeParse({
      ...validProject,
      roomType: 'castle',
    })
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'roomType')).toBe(true)
    }
  })

  it('fails when images array is empty', () => {
    const result = projectSchema.safeParse({
      ...validProject,
      images: [],
    })
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === 'images')).toBe(true)
    }
  })
})