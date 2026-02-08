import { useDragLayer } from 'react-dnd'
import { styles } from './box'
import { log } from 'console'

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '10%',
    height: '100%',
}

function getItemStyles(initialOffset: any, currentOffset: any) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }
    let { x, y } = currentOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform,
    }
}

export const CustomDragLayer = () => {
    const { isDragging, item, itemType, initialOffset, currentOffset } =
        useDragLayer((monitor) => {
            console.log(monitor.getItem());

            return {
                item: monitor.getItem(),
                itemType: monitor.getItemType(),
                initialOffset: monitor.getInitialSourceClientOffset(),
                currentOffset: monitor.getSourceClientOffset(),
                isDragging: monitor.isDragging(),
            }
        })

    if (!isDragging) {
        return null
    }

    return (
        <div style={layerStyles as any}>
            <div style={getItemStyles(initialOffset, currentOffset)}>
                {itemType === 'box' && (
                    <div style={{ ...styles, position: 'relative' } as any}>{item.title}</div>
                )}
            </div>
        </div>
    )
}
