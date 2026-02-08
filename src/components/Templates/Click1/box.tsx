import { useDrag } from 'react-dnd'
export const styles = {
    position: 'absolute' as const,
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    cursor: 'move',
}

export const Box = ({ id, left, top, hideSourceOnDrag, children, title }: any) => {
    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: 'box',
            item: { id, left, top, title },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [id, left, top, title],
    )
    if (isDragging) {
        return <div ref={drag} />
    }
    return (
        <div
            className="box"
            ref={drag}
            style={{ ...styles, left, top }}
            data-testid="box"
        >
            {children}
        </div>
    )
}

