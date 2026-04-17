export type ElementType = 'level' | 'space'

export interface Element {
    id: string;
    name: string;
    type: ElementType;
    levelId?: string;
    order: string
}