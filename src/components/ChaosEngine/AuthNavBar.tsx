import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const AuthNavBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button 
          onClick={() => navigate('/auth')} 
          variant="outline" 
          size="sm"
          className="font-mono text-xs"
        >
          <User className="w-3 h-3 mr-1" />
          SIGN IN
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 border border-primary/50 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs font-mono text-foreground">{user.email}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">OPERATOR</p>
        </div>
      </div>
      <Button 
        onClick={handleSignOut} 
        variant="ghost" 
        size="sm"
        className="text-muted-foreground hover:text-destructive"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AuthNavBar;
