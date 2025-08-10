type PostCardProps = {
  image: string;
  title: string;
  description: string;
  renderTags: (tags: string[]) => React.ReactNode[];
  tags: string[];
};

export default function PostCard({
  image,
  description,
  title,
  renderTags,
  tags,
}: PostCardProps) {
  return (
    <>
      <div className="card text-bg-dark">
        <img
          src={image}
          className="card-img card-img-top post-img"
          alt={title}
        />
        <div className="card-img-overlay d-flex flex-column justify-content-between">
          <p className="card-text">{description}</p>
          <div>{renderTags(tags)}</div>
        </div>
      </div>
    </>
  );
}
