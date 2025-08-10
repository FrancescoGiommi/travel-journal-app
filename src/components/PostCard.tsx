type PostCardProps = {
  image: string;
  title: string;
  description: string;
};

export default function PostCard({ image, description, title }: PostCardProps) {
  return (
    <>
      <div className="card text-bg-dark">
        <img
          src={image}
          className="card-img card-img-top post-img"
          alt={title}
        />
        <div className="card-img-overlay">
          <p className="card-text">{description}</p>
        </div>
      </div>
    </>
  );
}
