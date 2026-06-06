/**
 * QUE 원시고대플레이어
 */
const Player = ({ stageId }: { stageId: string }) => {
  return (
    <div>
      {/* 아마 PlayerCore 같은게 들어가겠지? */}
      <video controls>
        <source
          src={`/media/${stageId}/master.m3u8`}
          type="application/x-mpegURL"
        />
      </video>
    </div>
  );
};

export default Player;
