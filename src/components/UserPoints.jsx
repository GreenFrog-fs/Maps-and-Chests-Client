export default function UserPoints({ points }) {
  return (
    <div className="points">
      <img src="/icons/chest.png" />
      <p>{points}</p>
    </div>
  );
}
