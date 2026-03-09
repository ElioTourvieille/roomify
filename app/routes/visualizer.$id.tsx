import { useLocation } from "react-router";

const VisualizerId = () => {
  const location = useLocation();
  const [initialImage, name] = location.state || {};

  return (
    <section>
      <h1>{name || "Projet sans titre"}</h1>
      
      <div className="visualizer">
        {initialImage && (
          <div className="image-container">
            <h2>Image source</h2>
            <img src={initialImage} alt="Source" />
          </div>
        )}
      </div>
    </section>
  );
};

export default VisualizerId;
