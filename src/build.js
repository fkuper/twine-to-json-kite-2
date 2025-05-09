const fs = require('fs');
const VERSION = JSON.parse(fs.readFileSync('package.json')).version;

const AUTHOR = 'Frederik Kuper';

const FORMATS = [
    {
        name: 'Twine w/ Kite2 to JSON',
        version: VERSION,
        description: 'Convert Twine story with Kite2 customizations to JSON',
        scriptPath: 'src/twine-to-json.js',
        templatePath: 'templates/json.html',
        commandString: 'twineToJSON("twine")',
        buildPath: 'dist/twine.js',
    },
    {
        name: 'Harlowe 3 w/ Kite2 to JSON',
        version: VERSION,
        description: 'Convert Harlowe 3-formatted Twine story with Kite2 customizations to JSON',
        scriptPath: 'src/twine-to-json.js',
        templatePath: 'templates/json.html',
        commandString: 'twineToJSON("harlowe-3")',
        buildPath: 'dist/harlowe-3.js',
    },
];


function build() {
    FORMATS.forEach((format) => {
        _buildFormat(format);
    });
}
build();


function _buildFormat({ name, version, description, scriptPath, templatePath, commandString, buildPath }) {
    const source = _generateSource({ scriptPath, templatePath, commandString });
    const format = _generateFormat({ name, version, description, source });
    fs.writeFileSync(buildPath, format, 'utf8');
}


function _generateSource({ scriptPath, templatePath, commandString }) {
    const scriptText = fs.readFileSync(scriptPath, 'utf8').replace(/\\/g, '\\\\');
    const templateText = fs.readFileSync(templatePath, 'utf8');
    const source = templateText.replace('{{SCRIPT}}', scriptText).replace('{{COMMAND}}', commandString);
    return source;
}


function _generateFormat({ name, version, description, source }) {
    return `\
window.storyFormat({
    "name": "${name}",
    "version": "${version}",
    "author": "${AUTHOR}",
    "description": "${description}",
    "proofing": false,
    "source": \`
${source}\`
});
`
}
