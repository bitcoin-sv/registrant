
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, PackageSearch } from "lucide-react";
import { RegistryCard } from "@/components/RegistryCard";
import { RegistryForm } from "@/components/RegistryForm";
import { MockRegistryClient } from "@/lib/mockRegistryClient";
import { RegistryKind, RegistryRecord } from "@/types/registry";

// Mock client instance
const client = new MockRegistryClient();

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<RegistryKind>("basket");
  const [items, setItems] = useState<RegistryRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = async () => {
    try {
      const records = await client.listOwnRegistryEntries(activeTab);
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
    setIsLoading(true);
    loadItems();
  }, [activeTab]);

  const handleRegister = async (formData: Record<string, string>) => {
    try {
      setIsFormOpen(false);
      await client.registerItem({
        kind: activeTab,
        ...formData,
      });
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
      await client.revokeOwnRegistryEntry(activeTab, item);
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
          <p className="text-sm mt-2">Click the "Register New" button above to get started</p>
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
    <div className="container max-w-5xl mx-auto py-8 px-4 min-h-screen animate-fade-in">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Registrant</h1>
        <p className="text-muted-foreground">
          Register and manage your entries for baskets, protocols, and certificate types.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RegistryKind)}>
        <div className="flex items-center justify-between mb-6">
          <TabsList className="w-[400px]">
            <TabsTrigger value="basket" className="flex-1">Baskets</TabsTrigger>
            <TabsTrigger value="proto" className="flex-1">Protocols</TabsTrigger>
            <TabsTrigger value="cert" className="flex-1">Certificate Types</TabsTrigger>
          </TabsList>
          <Button 
            onClick={() => setIsFormOpen(true)}
            size={items.length === 0 ? "lg" : "default"}
            className={items.length === 0 ? "animate-pulse" : ""}
          >
            <Plus className="mr-2 h-4 w-4" />
            Register New
          </Button>
        </div>

        <TabsContent value="basket" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value="proto" className="mt-6">
          {renderContent()}
        </TabsContent>

        <TabsContent value="cert" className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>

      <RegistryForm
        kind={activeTab}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleRegister}
      />
    </div>
  );
};

export default Index;
