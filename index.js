import "@logseq/libs";

const settingsTemplate = [
  {
    key: "doneSound",
    type: "string",
    default: "",
    title: "Sound for marking as DONE",
    description: "Provide an absolute path to a sound file",
  },
];

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
    if (taskBlock) beep();
  });
};

logseq.ready(main).catch(console.error);
