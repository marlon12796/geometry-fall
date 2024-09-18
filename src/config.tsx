
export const SHAPES = ['box', 'sphere', 'cylinder', 'tetrahedron'] as const
export type ShapeType = typeof SHAPES[number]
