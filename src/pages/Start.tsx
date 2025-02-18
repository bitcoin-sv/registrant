
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Start = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleWalletLogin = () => {
    // In a real implementation, this would connect to the user's wallet
    login('wallet');
    toast({
      title: "Connected to wallet",
      description: "Successfully connected to your local wallet",
    });
  };

  const handlePrivateKeyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateKey.match(/^[0-9a-fA-F]{64}$/)) {
      toast({
        title: "Invalid private key",
        description: "Please enter a valid 32-byte hex-encoded private key",
        variant: "destructive",
      });
      return;
    }
    login('privateKey', privateKey);
  };

  if (showPrivateKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-8 p-4 sm:p-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Enter Private Key</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your private key to access the registry
            </p>
          </div>

          <form onSubmit={handlePrivateKeyLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your private key never leaves your browser and is only used to sign transactions
              </p>
            </div>
            <div className="space-x-4">
              <Button type="submit">Login</Button>
              <Button type="button" variant="outline" onClick={() => setShowPrivateKeyInput(false)}>
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 p-4 sm:p-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Registrant</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Register and manage your entries for baskets, protocols, and certificate types.
          </p>
        </div>

        <div className="grid gap-4">
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handleWalletLogin}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Use Local Wallet
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full"
            onClick={() => setShowPrivateKeyInput(true)}
          >
            <Key className="mr-2 h-4 w-4" />
            Enter Private Key
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Start;
