export default function Head({ params }: { params: { identifier: string } }) {
  console.log(params)
  return (
    <>
      <title>{`${params.identifier} | Ucho-ten`}</title>
    </>
  )
}
