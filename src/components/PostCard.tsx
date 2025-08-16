type PostCardProps = {
  image: string;
  title: string;
  renderTags: (tags: string[]) => React.ReactNode[];
  tags: string[];
  humor: string;
  humorIcons: Record<string, string>;
  expense_euro: number;
  expenceTagsColor?: (expense: number) => React.ReactNode;
};

export default function PostCard({
  image,
  title,
  renderTags,
  tags,
  humor,
  humorIcons,
  expense_euro,
  expenceTagsColor = (expense) => (
    <p className="badge text-bg-secondary">{expense} €</p>
  ),
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
          <div className="d-flex justify-content-between">
            <p className="card-text">{title}</p>
            <span>{expenceTagsColor(expense_euro)}</span>
          </div>
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
