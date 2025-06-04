import splash from "../assets/splash.png";

/**
 * 스플래시 화면에 대한 시각적 컴포넌트
 */
const Splash = () => {
  return (
    <div className="splash-container">
      <img src={splash} alt="splash"></img>
    </div>
  );
};

export default Splash;
