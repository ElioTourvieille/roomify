import { Box } from "lucide-react";
import { Button } from "./ui/Button";
import { useOutletContext } from "react-router";

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`Puter sign out failed: ${e}`);
      }

      return;
    }

    try {
      await signIn();
    } catch (e) {
      console.error(`Puter sign in failed: ${e}`);
    }
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </div>

          <ul className="links">
            <a href="#">Produit</a>
            <a href="#">Prix</a>
            <a href="#">Communauté</a>
            <a href="#">Entreprise</a>
          </ul>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Bonjour, ${userName}` : "Connectez-vous"}
              </span>

              <Button size="sm" onClick={handleAuthClick} className="btn">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={handleAuthClick} variant="ghost">
                Connexion
              </Button>

              <a href="#upload" className="cta">
                Commencer
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
