import "./Cell.css";

interface CellProps extends CommonProps {
  highlight: boolean;
  value: string;
  onChange: (x: number, y: number, character: string) => void;
  label?: string;
}

interface CommonProps {
  x: number;
  y: number;
  size: number;
}

export function Block({ x, y, size }: CommonProps) {
  return (
    <div
      data-x={x}
      data-y={y}
      className="cell cell__block"
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

export function Cell({
  x,
  y,
  size,
  highlight,
  label,
  value,
  onChange,
}: CellProps) {
  return (
    <div
      data-x={x}
      data-y={y}
      className="cell"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {label && <strong className="cell__label">{label}</strong>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(x, y, e.target.value)}
        maxLength={1}
        className="cell__input"
        style={{
          fontSize: `${size / 2}px`,
          backgroundColor: highlight ? "#84DBB2" : "",
        }}
      />
    </div>
  );
}
