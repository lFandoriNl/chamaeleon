import { Level } from './types';

type LogItemProps = {
  className: string;
  level: Level;
  time: number;
  data: string;
};

const formatTime = (time: number) => {
  const date = new Date(time);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

export const LogItem = ({ className, level, time, data }: LogItemProps) => {
  return (
    <div
      className={`p-2${
        className ? ` ${className}` : ''
      } flex border-b border-black
  last:border-b-0`}
    >
      <pre className="pr-4 text-sm">{level.padEnd(6, ' ')}</pre>
      <pre className="pr-4 text-sm">{formatTime(time)}</pre>
      <pre className="text-xs">{data}</pre>
    </div>
  );
};
