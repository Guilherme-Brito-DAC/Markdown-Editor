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
        const converter = new showdown.Converter({
            simplifiedAutoLink: true,
            tasklists: true,
            tables: true,
            strikethrough: true,
            ghMentionsLink: true,
        })

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

function exportFile(fileName) {
    try {
        const markdown = editor.getValue()

        const link = document.createElement("a")

        const file = new Blob([markdown], { type: 'text/markdown' })

        link.href = URL.createObjectURL(file)
        link.download = fileName + ".md"
        link.click()
        URL.revokeObjectURL(link.href)
    } catch (error) {
        console.log(error)
    }
}

function insertEffectOnText(value, jsonInfo) {
    editor.executeEdits("", [
        { range: new monaco.Range(jsonInfo.startLineNumber, jsonInfo.startColumn, jsonInfo.endLineNumber, jsonInfo.endColumn), text: value }
    ])
}

function format(html) {
    var tab = '\t'
    var result = ''
    var indent = ''

    html.split(/>\s*</).forEach(function (element) {
        if (element.match(/^\/\w/)) {
            indent = indent.substring(tab.length);
        }

        result += indent + '<' + element + '>\r\n';

        if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
            indent += tab;
        }
    })

    return result.substring(1, result.length - 3)
}

function getValueAlign(direction, selection) {
    const regex = /<div[\s\S]*?>([\s\S]*?)<\/div>/
    const match = selection.match(regex)

    let value = ""

    if (!match)
        value = `<div style="text-align: ${direction}">${selection}</div>`
    else
        value = match[1].trim()

    return value
}

function loadToolTips() {
    tippy('#addBold', {
        content: "Bold",
    })

    tippy('#addItalic', {
        content: "Italic",
    })

    tippy('#addUnderlined', {
        content: "Underlined",
    })

    tippy('#addStrikeThrough', {
        content: "Strike Though",
    })

    tippy('#addAlignLeft', {
        content: "Align Left",
    })

    tippy('#addAlignCenter', {
        content: "Align Center",
    })

    tippy('#addAlignRight', {
        content: "Align Right",
    })

    tippy('#addListBulleted', {
        content: "Bulleted List",
    })

    tippy('#addListNumbered', {
        content: "Numbered List",
    })

    tippy('#addCheckList', {
        content: "Checklist",
    })

    tippy('#addQuote', {
        content: "Quote",
    })

    tippy('#addCode', {
        content: "Code",
    })
}

document.getElementById('addBold').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = ""
    let isBoldAndItalic = selection.startsWith("***")

    if (!selection.startsWith("**"))
        value = "**" + selection + "**"
    else if (isBoldAndItalic)
        value = selection.slice(2, -2)
    else
        value = selection.replaceAll("**", "")

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addItalic').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = ""

    let isBoldAndItalic = selection.startsWith("***")
    let isBold = selection.startsWith("**")

    if (isBoldAndItalic)
        value = selection.slice(1, -1)
    else if (isBold)
        value = "*" + selection + "*"
    else if (!selection.startsWith("*"))
        value = "*" + selection + "*"
    else
        value = selection.replaceAll("*", "")

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addUnderlined').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    const regex = /<u[\s\S]*?>([\s\S]*?)<\/u>/
    const match = selection.match(regex)

    let value = ""

    if (!match)
        value = `<u>${selection}</u>`
    else
        value = match[1].trim()

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addStrikeThrough').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = ""

    if (!selection.startsWith("~~"))
        value = "~~" + selection + "~~"
    else
        value = selection.replaceAll("~~", "")

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addAlignLeft').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = getValueAlign("left", selection)

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addAlignCenter').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = getValueAlign("center", selection)

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addAlignRight').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = getValueAlign("right", selection)

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addListBulleted').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = ""

    if (!selection.startsWith("- "))
        value = "- " + selection
    else
        value = selection.replaceAll("- ", "")

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addListNumbered').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = ""

    if (!selection.startsWith("1. "))
        value = "1. " + selection
    else
        value = selection.replaceAll("1. ", "")

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addCheckList').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = ""

    if (!selection.startsWith("- [ ] "))
        value = "- [ ] " + selection
    else
        value = selection.replaceAll("- [ ] ", "")

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addQuote').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    let value = ""

    if (!selection.startsWith("> "))
        value = "> " + selection
    else
        value = selection.replaceAll("> ", "")

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
})

document.getElementById('addCode').addEventListener('click', function () {
    let selection = editor.getModel().getValueInRange(editor.getSelection())

    const regex = /<code[\s\S]*?>([\s\S]*?)<\/code>/
    const match = selection.match(regex)

    let value = ""

    if (!match)
        value = `<code>${selection}</code>`
    else
        value = match[1].trim()

    const jsonInfo = editor.getSelection()

    insertEffectOnText(value, jsonInfo)
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
    exportFile(document.getElementById("fileName").value)
})

document.getElementById('saveAsFileMobile').addEventListener('click', function () {
    exportFile(document.getElementById("fileNameMobile").value)
})

document.getElementById('btnCode').addEventListener('click', function () {
    document.getElementById('btnPreview').classList.remove("navigation-active")
    document.getElementById('btnCode').classList.add("navigation-active")
    document.getElementById('container').style.display = "block"
    document.getElementById('preview').style.display = "none"
})

document.getElementById('btnPreview').addEventListener('click', function () {
    document.getElementById('btnPreview').classList.add("navigation-active")
    document.getElementById('btnCode').classList.remove("navigation-active")
    document.getElementById('preview').style.display = "block"
    document.getElementById('container').style.display = "none"
})

initializeMonaco()

setTimeout(() => {
    loading(false)
    loadToolTips()
}, 500)