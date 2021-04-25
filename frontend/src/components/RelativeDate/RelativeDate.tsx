import React, { useMemo } from 'react';
import sAgo from 's-ago';

interface RelativeDateProps {
  date: Date;
}

export const RelativeDate: React.FC<RelativeDateProps> = (props) => {
  const { date } = props;

  const relative = useMemo(() => sAgo(date), [date]);

  const full = useMemo(
    () =>
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString(undefined, { timeStyle: 'long', hour12: false }),
    [date]
  );

  return <span title={full}>{relative}</span>;
};
