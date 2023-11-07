#!/usr/bin/env node

const { Engine } = require("@aux4/engine");
const Manual = require("../lib/Manual");

process.title = "aux4-man";

const config = {
  profiles: [
    {
      name: "main",
      commands: [
				{
 					name: "aux4",
          execute: [
					  "profile:aux4"
          ]
				}
      ]
    },
		{
			name: "aux4",
			commands: [
				{
          name: "man",
          execute: async () => {
            await Manual.read();
          },
          help: {
            text: ""
          }
        }
			]
		}
  ]
};

(async () => {
  const engine = new Engine({ aux4: config });

  const args = process.argv.splice(2);

  try {
    await engine.run(args);
  } catch (e) {
    console.error(e.message.red, e);
    process.exit(1);
  }
})();
