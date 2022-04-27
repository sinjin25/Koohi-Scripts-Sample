grunt-prompt is a multiTask. That means that the config has to follow a certain format. This is bad, since we're trying to modularize files.
Different prompts for different scripts will be here.
They should be inserted into the main Gruntfile.js config as follows:

# Example
prompts for amazon-download:

root/grunt-scripts/tasks/prompt
amazon-download-prompt.json
{
    // prompts, each with a "config" like config: "amazon-download.somePrompt"
}

root/gulfile.js
grunt.configInit({
    prompts: { // the multiTask config
        "amazon-download": grunt.file.getJSON('grunt-scripts/tasks/prompt/amazon-download-prompt.json')
    }
})