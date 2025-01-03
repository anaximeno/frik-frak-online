import { useState } from "react";
import { StyledCell } from "../style";

interface ICellProps {
  key?: string;
  x: number;
  y: number;
  onDropItem?: (event: React.DragEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
  disable?: boolean;
}

const Cell = (props: ICellProps) => {
  const [isOver, setIsOver] = useState<boolean>(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = () => {
    setIsOver(true);
  };

  const handleDragLeave = () => {
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
      onDrop={!props.disable ? handleDrop : undefined}
      onClick={!props.disable ? handleOnClik : undefined}
      isOver={isOver}
    />
  );
};

export default Cell;
