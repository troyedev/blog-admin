import { Modal } from 'antd'

type Iprop = {
  width: number,
  open: boolean,
  title: string,
  setOpen: Function,
  render: Function,
}

const Dialog = ({ width, open, title, setOpen, render }: Iprop) => {
  return (
    <Modal
      width={width}
      title={title}
      open={open}
      onCancel={() => setOpen(false)}
      destroyOnClose={true}
      centered={true}
      footer={null}
    >{render()}</Modal>
  )
}

export default Dialog
