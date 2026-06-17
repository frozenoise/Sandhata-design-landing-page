// Sandhata intro film — stage composition.

function SdTimecode() {
  const t = useTime();
  const sec = Math.floor(t);
  React.useEffect(() => {
    const el = document.getElementById("video-root");
    if (el) el.setAttribute("data-screen-label", `Sandhata intro @ ${sec}s`);
  }, [sec]);
  return null;
}

function SdIntroApp() {
  return (
    <Stage width={1920} height={1080} duration={36} background="#FFFFFF" persistKey="sandhata-intro">
      <SdTimecode />
      <SdScene1 />
      <SdScene2 />
      <SdScene3 />
      <SdScene4 />
      <SdScene5 />
      <SdScene6 />
    </Stage>
  );
}

if (!window.__sdIntroMounted && document.getElementById("video-root")) {
  window.__sdIntroMounted = true;
  ReactDOM.createRoot(document.getElementById("video-root")).render(<SdIntroApp />);
}
