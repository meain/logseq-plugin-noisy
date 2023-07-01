import "@logseq/libs";

// TODO: Maybe provide a bulitin sound collection
const settingsTemplate = [
  {
    key: "doneSound",
    type: "string",
    default: "",
    title: "Sound for marking as DONE",
    description: "Provide an absolute path to a sound file",
  },
];

let notified = {};

function beep() {
  // TODO: Optionally load sound mentioned in config
  const audioUrl = require("url:./default-sound.mp3");
  const snd = new Audio(audioUrl);
  snd.play();
}

const main = async () => {
  console.log("Noisy plugin loaded");
  logseq.useSettingsSchema(settingsTemplate);

  logseq.DB.onChanged(async (e) => {
    const taskBlock = e.blocks.find((block) => block.marker === "DONE");
    if (!taskBlock) return;

    // Don't notify if already notified in the last .5s. This is
    // necessary as any other change to the block will trigger this
    // event and we should not play it twice.
    if (notified[taskBlock.id]) {
      const lastNotified = notified[taskBlock.id];
      const now = Date.now();
      const diff = now - lastNotified;
      if (diff < 500) return;
    }

    beep();
    notified[taskBlock.id] = Date.now(); // save timestamp
  });
};

logseq.ready(main).catch(console.error);
