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
  pid: string;
  draggable?: boolean;
  isSelected?: boolean;
  color?: string;
  onClick?: (event: React.MouseEvent) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  disable?: boolean;
}

const Piece = (props: IPieceProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragStart = (event: React.DragEvent) => {
    setIsDragging(true);
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        from: {
          pid: props.pid,
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
      key={`${props.pid}-${props.i}-${props.j}`}
      draggable={!props.disable && props.draggable}
      x={props.x}
      y={props.y}
      isDragging={isDragging}
      isSelected={props.isSelected}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={!props.disable ? props.onClick : undefined}
      color={props.color}
    />
  );
};

export default Piece;
