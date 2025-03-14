
import { act, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, PackageSearch, LogOut } from "lucide-react";
import { RegistryCard } from "@/components/RegistryCard";
import { RegistryForm } from "@/components/RegistryForm";
// import { MockRegistryClient } from "@/lib/mockRegistryClient";
import { DefinitionData, DefinitionType, IdentityClient, RegistryClient, RegistryRecord, WalletClient } from '@bsv/sdk'
// import { RegistryKind, RegistryRecord } from "@/types/registry";
import { useAuth } from "@/contexts/AuthContext";
// import { IdentityCard, IdentityProvider } from '@bsv/identity-react'
import { IdentityCard } from 'metanet-identity-react'

const client = new RegistryClient();

const Index = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DefinitionType>("basket");
  const [currentUser, setCurrentUser] = useState('unknown')
  const [items, setItems] = useState<RegistryRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    try {
      console.log('active tab', activeTab)
      const records = await client.listOwnRegistryEntries(activeTab);
      console.log('R', records)
      setItems(records);
    } catch (error) {
      toast({
        title: "Error loading items",
        description: "Failed to load registry items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (currentUser === 'unknown') {
        setCurrentUser((await new WalletClient().getPublicKey({ identityKey: true })).publicKey)
      }
    })()
    setIsLoading(true);
    loadItems();
  }, [activeTab]);

  const handleRegister = async (formData: DefinitionData) => {
    try {
      await client.registerDefinition(formData);
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Item registered successfully",
      });
      loadItems();
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Failed to register item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRevoke = async (item: RegistryRecord) => {
    try {
      await client.revokeOwnRegistryEntry(item);
      toast({
        title: "Success",
        description: "Item revoked successfully",
      });
      loadItems();
    } catch (error) {
      toast({
        title: "Revocation failed",
        description: "Failed to revoke item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-64 bg-muted rounded"></div>
            <div className="h-12 w-48 bg-muted rounded"></div>
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <PackageSearch className="h-12 w-12 mb-4" />
          <p>No items registered yet</p>
          <p className="text-sm mt-2 text-center px-4">Click the "Register New" button above to get started</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <RegistryCard
            key={item.txid}
            item={item}
            onRevoke={() => handleRevoke(item)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container max-w-5xl mx-auto py-4 sm:py-8 px-4 min-h-screen animate-fade-in overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div className="space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Registrant</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Register and manage your entries for baskets, protocols, and certificate types.
          </p>
        </div>
        <Button variant="ghost" onClick={logout} className="text-muted-foreground self-end sm:self-start">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        <IdentityCard identityKey={currentUser} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DefinitionType)} className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-0 sm:justify-between">
          <TabsList className="w-full sm:w-[400px]">
            <TabsTrigger value="basket" className="flex-1">Baskets</TabsTrigger>
            <TabsTrigger value="protocol" className="flex-1">Protocols</TabsTrigger>
            <TabsTrigger value="certificate" className="flex-1">Certificates</TabsTrigger>
          </TabsList>
          <Button
            onClick={() => setIsFormOpen(true)}
            size={items.length === 0 ? "lg" : "default"}
            className={`w-full sm:w-auto ${items.length === 0 ? "animate-pulse" : ""}`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Register New
          </Button>
        </div>

        <TabsContent value="basket" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value="protocol" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value="certificate" className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
      <RegistryForm
        type={activeTab}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleRegister}
      />
    </div>
  );
};

export default Index;
