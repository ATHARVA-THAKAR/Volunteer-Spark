import { useNavigate } from "react-router-dom";
import { Heart, ShieldCheck, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <Heart className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
          Welcome to Zeal
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Volunteer well-being & engagement tracker
        </p>
      </div>

      <p className="mb-8 text-center text-base font-medium text-foreground">
        How would you like to continue?
      </p>

      <div className="flex w-full max-w-2xl flex-col gap-6 sm:flex-row">
        <Card
          onClick={() => navigate("/auth/admin")}
          className="group flex-1 cursor-pointer border-2 border-transparent transition-all hover:border-primary hover:shadow-lg"
        >
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary">
              <ShieldCheck className="h-7 w-7 text-accent-foreground transition-colors group-hover:text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Admin</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage volunteers, view analytics, and oversee well-being check-ins.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => navigate("/auth/volunteer")}
          className="group flex-1 cursor-pointer border-2 border-transparent transition-all hover:border-primary hover:shadow-lg"
        >
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent transition-colors group-hover:bg-primary">
              <Users className="h-7 w-7 text-accent-foreground transition-colors group-hover:text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Volunteer</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Submit check-ins, track your morale, and stay connected with your team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
