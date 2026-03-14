export default function BrandCard({ brand }) {
  return (
    <article className="brand">
      <h3>{brand.name}</h3>
      <p>{brand.description}</p>
      <div className="brand-tags">
        {brand.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}
