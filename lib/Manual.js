const fs = require("fs");
const Markdown = require("markdown-it");
const terminal = require("markdown-it-terminal");
const keypress = require("keypress");

const markdown = new Markdown();
markdown.use(terminal);

class Manual {
  static async read() {
    const manual = fs.readFileSync("./test/demo.md", { encoding: "utf-8" });
    const markdownManual = markdown.render(manual);
    const manualLines = markdownManual.split("\n");

    if (!process.stdin.isTTY) {
      render(manualLines);
      return;
    }

    process.stdin.setRawMode(true);
    keypress(process.stdin);

    let offset = 0;
    let maxLength = process.stdout.rows - 1;

    process.stdin.on("keypress", (ch, key) => {
      if (!key) return;

      if (key.ctrl && key.name === "c") {
        process.stdin.pause();
      } else if (key.name === "q") {
        process.stdin.pause();
			} else if (key.ctrl && key.name === "f") {
				offset = scroll(offset, maxLength, manualLines.length, maxLength);
				render(manualLines.slice(offset, offset + maxLength));
			} else if (key.ctrl && key.name === "b") {
				offset = scroll(offset, maxLength, manualLines.length, -maxLength);
				render(manualLines.slice(offset, offset + maxLength));
      } else if (key.ctrl && key.name === "d") {
				offset = scroll(offset, maxLength, manualLines.length, maxLength / 2);
				render(manualLines.slice(offset, offset + maxLength));
			} else if (key.ctrl && key.name === "u") {
				offset = scroll(offset, maxLength, manualLines.length, -maxLength / 2);
				render(manualLines.slice(offset, offset + maxLength));
			} else if (key.name === "up") {
        if (offset > 0) {
          offset = offset - 1;
          render(manualLines.slice(offset, offset + maxLength));
        }
      } else if (key.name === "down") {
        if (offset < manualLines.length - maxLength) {
          offset = offset + 1;
          render(manualLines.slice(offset, offset + maxLength));
        }
      }
    });

    render(manualLines.slice(offset, maxLength));
  }
}

function scroll(offset, maxLength, length, lines) {
	let newOffset = offset + lines;
	if (newOffset < 0) newOffset = 0;
  if (newOffset > length - maxLength) newOffset = length - maxLength;	
  return newOffset;
}

function render(lines) {
  console.clear();
  process.stdout.write(lines.join("\n"));
}

module.exports = Manual;
