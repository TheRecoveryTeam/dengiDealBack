const createApp = require('../src/app');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'config', alias: 'c', type: String },
];

const options = commandLineArgs(optionDefinitions);
const config = require(options.config);

(async () => {
    const App = await createApp(config);
    App.listen(config.port || 3000);
    console.log(`App listening on ${config.port || 3000}`);
})();
