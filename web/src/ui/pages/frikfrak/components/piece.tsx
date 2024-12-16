import { useState } from "react";
import { DraggablePiece } from "../style";

export interface IPieceCoordinate {
  x: number;
  y: number;
}

interface IPieceProps extends IPieceCoordinate {
  id: string;
  draggable?: boolean;
  color?: string;
}

const Piece = (props: IPieceProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragStart = (event: React.DragEvent) => {
    setIsDragging(true);
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        from: {
          id: props.id,
          x: props.x,
          y: props.y,
        },
      })
    );
  };

  const handleDragEnd = (event: React.DragEvent) => {
    setIsDragging(false);
  };

  return (
    <DraggablePiece
      draggable={props.draggable}
      x={props.x}
      y={props.y}
      isDragging={isDragging}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      color={props.color}
    />
  );
};

export default Piece;
