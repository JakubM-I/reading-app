interface SummaryListProps {
  title: string
  items: string[]
  emptyText: string
}

export function SummaryList({ title, items, emptyText }: SummaryListProps) {
  return (
    <section>
      <h3>{title}</h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{emptyText}</p>
      )}
    </section>
  )
}
