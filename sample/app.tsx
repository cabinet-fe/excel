import { render } from 'solid-js/web'
import { Workbook } from 'excel'

function FilePicker() {
  async function handleInput(e: InputEvent) {
    const target = e.target as HTMLInputElement

    const file = target.files![0]!

    const wb = new Workbook('某个文件')
    await wb.read(file)

    target.value = ''
  }
  return <input onInput={handleInput} type='file' />
}

render(() => <FilePicker />, document.body)
