import React from 'react';

export interface HeadingProps {
  value: string;
}

const Heading: React.FC<HeadingProps> = ({value}) => (
  <h1>{value}</h1>
);

export default Heading;
