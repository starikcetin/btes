import React from 'react';

interface MarkdownProps {
  html: string;
}

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const { html: raw } = props;

  return <div dangerouslySetInnerHTML={{ __html: raw }} />;
};
