import { useState } from "react";
import { StyledCell } from "../style";

interface ICellProps {
  key?: string;
  x: number;
  y: number;
  onDropItem?: (event: React.DragEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
}

const Cell = (props: ICellProps) => {
  const [isOver, setIsOver] = useState<boolean>(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent) => {
    setIsOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    setIsOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    props.onDropItem?.(event);
  };

  const handleOnClik = (event: React.MouseEvent) => {
    props.onClick?.(event);
  };

  return (
    <StyledCell
      key={props.key}
      x={props.x}
      y={props.y}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleOnClik}
      isOver={isOver}
    />
  );
};

export default Cell;
