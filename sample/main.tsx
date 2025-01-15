import { render } from 'solid-js/web'
import { XLSX } from '../src'

function FilePicker() {
  async function handleInput(e: InputEvent) {
    const target = e.target as HTMLInputElement

    const file = target.files![0]!

    XLSX.load(await file.arrayBuffer())

    target.value = ''
  }
  return <input onInput={handleInput} type='file' />
}

render(() => <FilePicker />, document.body)
