import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Check for user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-playfair font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Cabinet Maître Diarra
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/immobilier">Immobilier</NavLink>
            <NavLink to="/equipe">Notre Équipe</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-inter text-sm"
              >
                Se déconnecter
              </button>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-inter text-sm"
              >
                Se connecter
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden p-4 animate-fade-in">
              <div className="flex flex-col space-y-4">
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/immobilier">Immobilier</NavLink>
                <NavLink to="/equipe">Notre Équipe</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-inter text-sm"
                  >
                    Se déconnecter
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-inter text-sm"
                  >
                    Se connecter
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="font-inter text-primary hover:text-accent transition-colors duration-200"
  >
    {children}
  </Link>
);

export default Navbar;