import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/+esm';
const example = `oi`

let editor

function initializeMonaco() {
    try {
        monaco.editor.defineTheme('custom', {
            base: 'vs-dark',
            inherit: true,
            colors: {
                'editor.background': '#1e1f23',
            },
            rules: [],
        })

        monaco.editor.setTheme('custom')

        editor = monaco.editor.create(document.getElementById("container"), {
            value: example,
            language: "markdown",
            automaticLayout: true,
        })

        editor.getModel().onDidChangeContent((event) => {
            renderPreview()
        })
        
        renderPreview()
    } catch (error) {
        console.log(error)
    }
}

function renderPreview() {
    try {
        document.getElementById("preview").innerHTML = ""

        const markdown = editor.getValue()
        const converter = new showdown.Converter()

        document.getElementById("preview").innerHTML = converter.makeHtml(markdown);
    } catch (error) {
        console.log(error)
    }
}

function exportFile() {
    try {

    } catch (error) {
        console.log(error)
    }
}

initializeMonaco()