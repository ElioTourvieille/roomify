import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, Clock, ArrowUpRight, Layers, Upload } from "lucide-react";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomify" },
    {
      name: "description",
      content:
        "Roomify est un environnement de conception axé sur l'IA qui vous aide à visualiser, rendre et livrer vos projets architecturaux plus rapidement que jamais.",
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Présentation de Roomify 2.0</p>
        </div>

        <h1>
          Créez de magnifiques espaces à la vitesse de la pensée avec Roomify
        </h1>

        <p className="subtitle">
          Roomify est un environnement de conception axé sur l'IA qui vous aide
          à visualiser, rendre et livrer vos projets architecturaux plus
          rapidement que jamais.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Commencer la construction <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg" className="demo">
            Regarder la démo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />

          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>

              <h3>Téléchargez votre plan de projet</h3>
              <p>Supporte les formats JPG, PNG, jusqu'à 10MB</p>
            </div>

            <p>Charger une image pour commencer</p>
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projets</h2>
              <p>
                Vos derniers projets et projets partagés par la communauté, tout
                en un seul endroit. place.
              </p>
            </div>
          </div>

          <div className="projects-grid">
            <div className="project-card group">
            <div className="preview">
              <img
                src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png"
                alt="Project"
              />

              <div className="badge">
                <span>Community</span>
              </div>
            </div>

            <div className="card-body">
              <div>
                <h3>Projet Manhattan</h3>

                <div className="meta">
                  <Clock size={12} />
                  <span>{new Date(1770803585402).toLocaleDateString()}</span>
                  <span>Par Roomify</span>
                </div>
              </div>
              <div className="arrow">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
