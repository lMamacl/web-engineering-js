import { getImageUrl, type ImageSize } from './utils.tsx';

export interface ProfileProps {
  name: string;
  imageId: string;
  profession: string;
  awards: string[];
  discovery: string;
  imageSize?: number;
  imageThumbnailSize?: ImageSize;
}

export default function Profile({
  name,
  imageId,
  profession,
  awards,
  discovery,
  imageSize = 70,
  imageThumbnailSize = 's',
}: ProfileProps) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId, imageThumbnailSize)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession: </b>
          {profession}
        </li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}
