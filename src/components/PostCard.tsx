type PostCardProps = {
  image: string;
  title: string;
  description: string;
};

export default function PostCard({ image, description, title }: PostCardProps) {
  return (
    <>
      <img src={image} className="card-img-top post-img" alt={title} />
      <div className="card-body">
        <p className="card-text">{description}</p>
      </div>
    </>
  );
}
