import { Line, Cell, Board } from "./style";

const FrikFrakPage = () => {
  const handleClick = (index: number) => {
    // TODO
  };

  const cellPositions = [
    { x: 0, y: 0 }, // top left
    { x: 50, y: 0 }, // top center
    { x: 100, y: 0 }, // top right
    { x: 0, y: 50 }, // mid left
    { x: 50, y: 50 }, // mid center
    { x: 100, y: 50 }, // mid right
    { x: 0, y: 100 }, // bottom left
    { x: 50, y: 100 }, // bottom center
    { x: 100, y: 100 }, // bottom right
  ];

  return (
    <div style={{ marginTop: "200px" }}>
      <Board>
        <Line style={{ transform: "rotate(45deg)", width: "150%" }} />
        <Line style={{ transform: "rotate(-45deg)", width: "150%" }} />
        <Line style={{ transform: "rotate(-90deg)", translate: "150px 0" }} />
        <Line style={{ transform: "rotate(-90deg)" }} />
        <Line style={{ transform: "rotate(-90deg)", translate: "-150px 0" }} />
        <Line style={{ translate: "0px -150px" }} />
        <Line />
        <Line style={{ translate: "0px 150px" }} />
        {cellPositions.map((value, index) => (
          <Cell
            key={index}
            x={value.x}
            y={value.y}
            onClick={() => handleClick(index)}
          >
            {/* {value} */}
          </Cell>
        ))}
      </Board>
    </div>
  );
};

export default FrikFrakPage;
