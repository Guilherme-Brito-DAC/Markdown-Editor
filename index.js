import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/+esm'
const example = `# Welcome to Markdown Editor!

Hi! I'm your first Markdown file in **Markdown Editor**. If you want to learn about Markdown 
Editor, you can read me. If you want to play with Markdown, you can edit me.`

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
        document.getElementById("body").innerHTML = ""

        const markdown = editor.getValue()
        const converter = new showdown.Converter()

        const html = converter.makeHtml(markdown)

        document.getElementById("body-html").textContent = format(html)
        document.getElementById("body").innerHTML = html
    } catch (error) {
        console.log(error)
    }
}

function loading(active) {
    if (active)
        document.getElementsByClassName("loading")[0].style.display = "flex"
    else
        document.getElementsByClassName("loading")[0].style.display = "none"
}

function exportFile() {
    try {
        const markdown = editor.getValue()

        const link = document.createElement("a")

        const file = new Blob([markdown], { type: 'text/markdown' })

        link.href = URL.createObjectURL(file)
        link.download = document.getElementById("fileName").value + ".md"
        link.click()
        URL.revokeObjectURL(link.href)
    } catch (error) {
        console.log(error)
    }
}

function insertEffectOnText(value, jsonInfo) {
    let currentMarkdown = editor.getValue()

    const lines = currentMarkdown.split('\n')

    const startIndex = lines[jsonInfo.startLineNumber - 1].substring(0, jsonInfo.startColumn - 1).length
    const endIndex = lines[jsonInfo.endLineNumber - 1].substring(0, jsonInfo.endColumn - 1).length

    lines[jsonInfo.startLineNumber - 1] = lines[jsonInfo.startLineNumber - 1].substring(0, startIndex) + value + lines[jsonInfo.endLineNumber - 1].substring(endIndex)

    currentMarkdown = lines.join('\n')

    editor.setValue(currentMarkdown)
}

function format(html) {
    var tab = '\t';
    var result = '';
    var indent = '';

    html.split(/>\s*</).forEach(function (element) {
        if (element.match(/^\/\w/)) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
            indent += tab;
        }
    });

    return result.substring(1, result.length - 3);
}

document.getElementById('addBold').addEventListener('click', function () {
    const value = "**" + editor.getModel().getValueInRange(editor.getSelection()) + "**"

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addItalic').addEventListener('click', function () {
    const value = "*" + editor.getModel().getValueInRange(editor.getSelection()) + "*"

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addStrikeThrough').addEventListener('click', function () {
    const value = "~~" + editor.getModel().getValueInRange(editor.getSelection()) + "~~"

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addAlignLeft').addEventListener('click', function () {

})

document.getElementById('addAlignCenter').addEventListener('click', function () {

})

document.getElementById('addAlignRight').addEventListener('click', function () {

})

document.getElementById('addListBulleted').addEventListener('click', function () {

})

document.getElementById('addListNumbered').addEventListener('click', function () {

})

document.getElementById('addLink').addEventListener('click', function () {

})

document.getElementById('addCode').addEventListener('click', function () {
    let value = "ˋ" + editor.getModel().getValueInRange(editor.getSelection()) + "ˋ"

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addImage').addEventListener('click', function () {

})

document.getElementById('toggleShowCode').addEventListener('click', function () {
    if (document.getElementById("body-html").style.display == "none") {
        document.getElementById("body-html").style.display = "block"
        document.getElementById("body").style.display = "none"
    }
    else {
        document.getElementById("body-html").style.display = "none"
        document.getElementById("body").style.display = "block"
    }
})

document.getElementById('saveAsFile').addEventListener('click', function () {
    exportFile()
})

initializeMonaco()

loading(false)

// setTimeout(() => {
//     loading(false)
// }, 1500)