/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line strict
'use strict';

const marked = require('marked');
const renderer = new marked.Renderer();

let headings = [];
let counters = {};

renderer.heading = function (text, level, raw) {
  let anchor =
    this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');

  if (counters[anchor] == null) {
    counters[anchor] = 0;
  } else {
    anchor += '--' + counters[anchor]++;
  }

  if (raw.includes('$$$START$$$')) {
    return '<div class="gen-markdown--content">';
  } else if (raw.includes('$$$END$$$')) {
    const tableOfContents = makeTableOfContents();
    headings = [];
    counters = {};
    return '</div>' + tableOfContents;
  } else {
    headings.push({
      anchor: anchor,
      level: level,
      text: text,
    });
    return `<a href="#${anchor}"><h${level} id="${anchor}">${text}</h${level}></a>`;
  }
};

function makeTableOfContents() {
  if (headings.length <= 0) {
    return '<div class="gen-markdown--table-of-contents"></div>';
  }

  let contentResult = '<ul>';
  let closeStack = [''];
  let previousLevel = headings[0].level;

  for (const it of headings) {
    const levelDiff = it.level - previousLevel;
    const isNesting = levelDiff > 0;
    const isUnnesting = levelDiff < 0;
    previousLevel = it.level;

    const elm = `<a href="#${it.anchor}">${it.text}</a>`;

    if (isNesting) {
      contentResult += `<ul><li>${elm}`;
      closeStack.push('</ul>', '</li>');
    } else if (isUnnesting) {
      const popAmount = levelDiff * -2 + 1;
      for (let i = 0; i < popAmount; i++) {
        contentResult += closeStack.pop();
      }

      contentResult += `<li>${elm}`;
      closeStack.push('</li>');
    } else {
      contentResult += closeStack.pop();
      contentResult += `<li>${elm}`;
      closeStack.push('</li>');
    }
  }

  contentResult += '</li></ul>';

  return `<div class="gen-markdown--table-of-contents">${contentResult}</div>`;
}

module.exports = renderer;
