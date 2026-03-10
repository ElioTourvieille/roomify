import { useLocation, useNavigate, useParams } from "react-router";
import { useState, useRef, useEffect } from "react";
import { generate3DView } from "lib/ai.action";
import { Button } from "components/ui/Button";
import { Box, Download, RefreshCcw, Share2, X } from "lucide-react";

const VisualizerId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { initialImage, initialRender, name } = location.state || {};

  const hasInitialGenerated = useRef(false);

  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(
    initialRender || null,
  );

  const handleBack = () => navigate("/");

  const runGeneration = async () => {
    if (!initialImage) return;

    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: initialImage });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        // update the project with the new rendered image
      }
    } catch (error) {
      console.error("Error generating 3D view:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!initialImage || hasInitialGenerated.current) return;

    if (initialRender) {
      setCurrentImage(initialRender);
      hasInitialGenerated.current = true;
    }

    hasInitialGenerated.current = true;
    runGeneration();
  }, [initialImage, initialRender]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <div className="brand">
          <Box className="logo" />

          <span className="name">Roomify</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" /> Quitter l'éditeur
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Projet</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className="note">Créé par Vous</p>
            </div>

            <div className="panel-actions">
              <Button
                size="sm"
                onClick={() => {}}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-2" /> Exporter
              </Button>
              <Button size="sm" onClick={() => {}} className="share">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="Rendu 3D" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {initialImage && (
                  <img src={initialImage} alt="Image source" className="render-fallback" />
                )}
                </div>
              )}

              {isProcessing && (
                <div className="render-overlay">
                  <div className="rendering-card">
                    <RefreshCcw className="spinner" />
                    <span className="title">Rendu en cours...</span>
                    <span className="subtitle">Génération de votre visualisation 3D</span>
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisualizerId;
