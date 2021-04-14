import React from 'react';

interface MarkdownProps {
  html: string;
}

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const { html: raw } = props;

  return (
    <div className="comp-markdown" dangerouslySetInnerHTML={{ __html: raw }} />
  );
};
