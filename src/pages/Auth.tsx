import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(128),
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Dispatch event to show terminal and navigate
      window.dispatchEvent(new CustomEvent('enter-arena'));
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuth = async (mode: 'signin' | 'signup') => {
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error } = mode === 'signin' 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('This email is already registered. Try signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password.');
        } else {
          toast.error(error.message);
        }
      } else if (mode === 'signup') {
        toast.success('Account created! You can now sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 scanlines">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
      </div>

      {/* Back button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-xs text-muted-foreground hover:text-primary transition-colors font-mono z-20"
      >
        ← BACK TO LANDING
      </button>

      <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-mono text-primary tracking-tight">
            CHAOS PROTOCOL
          </CardTitle>
          <CardDescription className="font-mono text-muted-foreground">
            AUTHENTICATION REQUIRED
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="font-mono">SIGN IN</TabsTrigger>
              <TabsTrigger value="signup" className="font-mono">SIGN UP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth('signin'); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="font-mono text-xs">EMAIL</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@protocol.io"
                    className="font-mono bg-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="font-mono text-xs">PASSWORD</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="font-mono bg-background/50"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full font-mono"
                  disabled={loading}
                >
                  {loading ? 'AUTHENTICATING...' : 'INITIATE SESSION'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth('signup'); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-mono text-xs">EMAIL</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@protocol.io"
                    className="font-mono bg-background/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-mono text-xs">PASSWORD</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="font-mono bg-background/50"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full font-mono"
                  disabled={loading}
                >
                  {loading ? 'REGISTERING...' : 'CREATE ACCOUNT'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
