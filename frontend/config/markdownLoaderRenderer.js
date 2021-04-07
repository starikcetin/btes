/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line strict
'use strict';

var marked = require('marked');
var renderer = new marked.Renderer();

var isFirstHeading = true;
var headings = [];
var counters = {};

renderer.heading = function (text, level, raw) {
  if (raw.includes('$$$TABLE_OF_CONTENTS$$$')) {
    return '</div>' + makeTableOfContents();
  }

  var anchor =
    this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');

  if (counters[anchor] == null) {
    counters[anchor] = 0;
  } else {
    anchor += '--' + counters[anchor]++;
  }

  headings.push({
    anchor: anchor,
    level: level,
    text: text,
  });

  const res =
    `${isFirstHeading ? '<div id="content">' : ''}` +
    `<a href="#${anchor}"><h${level} id="${anchor}">${text}</h${level}></a>`;
  isFirstHeading = false;
  return res;
};

function makeTableOfContents() {
  if (headings.length <= 0) {
    return '<div id="table-of-contents"></div>';
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

  headings = [];
  isFirstHeading = true;

  return `<div id="table-of-contents">${contentResult}</div>`;
}

module.exports = renderer;
