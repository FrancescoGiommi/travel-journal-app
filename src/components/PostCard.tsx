type PostCardProps = {
  image: string;
  title: string;
  renderTags: (tags: string[]) => React.ReactNode[];
  tags: string[];
  humor: string;
  humorIcons: Record<string, string>;
};

export default function PostCard({
  image,
  title,
  renderTags,
  tags,
  humor,
  humorIcons,
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
          <p className="card-text">{title}</p>
          <div className="d-flex justify-content-between">
            <div>{renderTags(tags)}</div>
            {humor && (
              <div className="badge text-bg-primary">
                {humorIcons[humor]} {humor}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
