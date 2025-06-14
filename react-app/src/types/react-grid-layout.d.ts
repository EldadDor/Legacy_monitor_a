
declare module 'react-grid-layout' {
    import React from 'react';

    export interface Layout {
        i: string;
        x: number;
        y: number;
        w: number;
        h: number;
        minW?: number;
        maxW?: number;
        minH?: number;
        maxH?: number;
        isDraggable?: boolean;
        isResizable?: boolean;
        static?: boolean;
        moved?: boolean;
    }

    export interface ReactGridLayoutProps {
        className?: string;
        style?: React.CSSProperties;
        width?: number;
        autoSize?: boolean;
        cols?: number;
        draggableCancel?: string;
        draggableHandle?: string;
        verticalCompact?: boolean;
        compactType?: 'vertical' | 'horizontal' | null;
        layout?: Layout[];
        margin?: [number, number];
        containerPadding?: [number, number];
        rowHeight?: number;
        maxRows?: number;
        isDraggable?: boolean;
        isResizable?: boolean;
        preventCollision?: boolean;
        useCSSTransforms?: boolean;
        transformScale?: number;
        onLayoutChange?: (layout: Layout[]) => void;
        onDragStart?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onDrag?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onDragStop?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onResizeStart?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onResize?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        onResizeStop?: (layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, event: MouseEvent, element: HTMLElement) => void;
        children: React.ReactNode;
    }

    export default class ReactGridLayout extends React.Component<ReactGridLayoutProps> {}

    export function WidthProvider<P>(
        ComposedComponent: React.ComponentType<P>
    ): React.ComponentType<P>;
}