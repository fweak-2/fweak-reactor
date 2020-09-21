const { React } = require ('powercord/webpack');
const { TextInput } = require ('powercord/components/settings');

module.exports = ({ getSetting, updateSetting }) => (
    <div>
      <TextInput
        note="Interval in-between reactions (ms)"
        defaultValue={getSetting("intervalTime", "1500")}
        onChange={(val) => updateSetting("intervalTime", val.toString())}
      >
        Interval
      </TextInput>
    </div>
  );