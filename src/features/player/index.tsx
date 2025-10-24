/**
 * QUE 원시고대플레이어
 */
const Player = () => {
  return (
    <div>
      {/* 아마 PlayerCore 같은게 들어가겠지? */}
      <video controls>
        <source src="/sample/samplevideo.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default Player;
