interface NewLineToBreakProps {
  text: string
}

export const NewLineToBreak = (props: NewLineToBreakProps) => {
  const { text } = props

  return (
    <>
      {text.split('\n').map((line, index) => (
        <>
          {line}
          <br />
        </>
      ))}
    </>
  )
}
