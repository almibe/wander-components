import {EditorView, basicSetup} from "codemirror"

export function showEditor(element, content) {
    const view = new EditorView({
        extensions: [basicSetup],
        parent: element
    })
    view.dispatch({
        changes: {from: 0, to: view.state.doc.length, insert: content}
    });
    return view
}
