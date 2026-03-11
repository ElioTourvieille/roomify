import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";
import {ArrowRight, ArrowUpRight, Clock, Layers} from "lucide-react";
import { Button } from "../../components/ui/Button";
import Upload from "../../components/Upload";
import {useNavigate} from "react-router";
import {useEffect, useRef, useState} from "react";
import {createProject, getProjects} from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roomify" },
    { name: "description", content: "Roomify est un environnement de conception axé sur l'IA qui vous aide à visualiser, rendre et livrer vos projets architecturaux plus rapidement  que jamais." },
  ];
}

export default function Home() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const isCreatingProjectRef = useRef(false);

    const handleUploadComplete = async (base64Image: string) => {
        try {

            if(isCreatingProjectRef.current) return false;
            isCreatingProjectRef.current = true;
            const newId = Date.now().toString();
            const name = `Résidence ${newId}`;

            const newItem = {
                id: newId, name, sourceImage: base64Image,
                renderedImage: undefined,
                timestamp: Date.now()
            }

            const saved = await createProject({ item: newItem, visibility: 'private' });

            if(!saved) {
                console.error("Failed to create project");
                return false;
            }

            setProjects((prev) => [saved, ...prev]);

            navigate(`/visualizer/${newId}`, {
                state: {
                    initialImage: saved.sourceImage,
                    initialRendered: saved.renderedImage || null,
                    name
                }
            });

            return true;
        } finally {
            isCreatingProjectRef.current = false;
        }
    }

    useEffect(() => {
        const fetchProjects = async () => {
            const items = await getProjects();

            setProjects(items)
        }

        fetchProjects();
    }, []);

  return (
      <div className="home">
          <Navbar />

          <section className="hero">
              <div className="announce">
                  <div className="dot">
                      <div className="pulse"></div>
                  </div>

                  <p>Découvrez Roomify 2.0</p>
              </div>

              <h1>Créez de beaux espaces à la vitesse de la pensée avec Roomify</h1>

              <p className="subtitle">
                  Roomify est un environnement de conception axé sur l'IA qui vous aide à visualiser, rendre et livrer vos projets architecturaux plus rapidement que jamais.
              </p>

              <div className="actions">
                  <a href="#upload" className="cta">
                      Commencer <ArrowRight className="icon" />
                  </a>

                  <Button variant="outline" size="lg" className="demo">
                      Voir la démo
                  </Button>
              </div>

              <div id="upload" className="upload-shell">
                <div className="grid-overlay" />

                  <div className="upload-card">
                      <div className="upload-head">
                          <div className="upload-icon">
                              <Layers className="icon" />
                          </div>

                          <h3>Téléchargez votre plan</h3>
                          <p>Formats JPG, PNG acceptés, jusqu'à 10 Mo</p>
                      </div>

                      <Upload onComplete={handleUploadComplete} />
                  </div>
              </div>
          </section>

          <section className="projects">
              <div className="section-inner">
                  <div className="section-head">
                      <div className="copy">
                          <h2>Projets</h2>
                          <p>Vos dernières créations et les projets partagés par la communauté, au même endroit.</p>
                      </div>
                  </div>

                  <div className="projects-grid">
                      {projects.map(({id, name, renderedImage, sourceImage, timestamp}) => (
                          <div key={id} className="project-card group" onClick={() => navigate(`/visualizer/${id}`)}>
                              <div className="preview">
                                  <img  src={renderedImage || sourceImage} alt="Project"
                                  />

                                  <div className="badge">
                                      <span>Communauté</span>
                                  </div>
                              </div>

                              <div className="card-body">
                                  <div>
                                      <h3>{name}</h3>

                                      <div className="meta">
                                          <Clock size={12} />
                                          <span>{new Date(timestamp).toLocaleDateString()}</span>
                                          <span>Par Roomify</span>
                                      </div>
                                  </div>
                                  <div className="arrow">
                                      <ArrowUpRight size={18} />
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      </div>
  )
}