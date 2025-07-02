
interface MinutesDetailCardProps {
  date: string;
  location: string;
}

export function MinutesDetailCard({ date, location }: MinutesDetailCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">Date</h3>
        <p>{date}</p>
      </div>
      <div>
        <h3 className="font-medium">Location</h3>
        <p>{location}</p>
      </div>
    </div>
  );
}
