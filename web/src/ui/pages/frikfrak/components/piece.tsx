import { useState } from "react";
import { DraggablePiece } from "../style";

export interface IPieceCoordinate {
  x: number;
  y: number;
}

export interface IPiecePosition {
  i: number;
  j: number;
}

interface IPieceProps extends IPieceCoordinate, IPiecePosition {
  id: string;
  draggable?: boolean;
  isSelected?: boolean;
  color?: string;
  onClick?: (event: React.MouseEvent) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
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
          i: props.i,
          j: props.j,
        },
      })
    );
    props.onDragStart?.(event);
  };

  const handleDragEnd = (event: React.DragEvent) => {
    setIsDragging(false);
    props.onDragEnd?.(event);
  };

  return (
    <DraggablePiece
      draggable={props.draggable}
      x={props.x}
      y={props.y}
      isDragging={isDragging}
      isSelected={props.isSelected}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={props.onClick}
      color={props.color}
    />
  );
};

export default Piece;
