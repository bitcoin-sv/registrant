
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RegistryKind } from "@/types/registry";

interface RegistryFormProps {
  kind: RegistryKind;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}

export const RegistryForm = ({
  kind,
  open,
  onClose,
  onSubmit,
}: RegistryFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSubmit(e as any);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (open) {
      setFormData({});
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Register New {kind.charAt(0).toUpperCase() + kind.slice(1)}</DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new {kind} in the registry.
            Press <kbd className="px-2 py-1 text-xs rounded bg-muted">⌘ + Enter</kbd> to submit.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {kind === "basket" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basketID">Basket ID</Label>
                <Input
                  id="basketID"
                  required
                  onChange={(e) => updateField("basketID", e.target.value)}
                />
              </div>
            </div>
          )}

          {kind === "proto" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="protocolID">Protocol ID</Label>
                <Input
                  id="protocolID"
                  required
                  onChange={(e) => updateField("protocolID", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityLevel">Security Level</Label>
                <Select
                  onValueChange={(value) => updateField("securityLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Level 0 (Basic)</SelectItem>
                    <SelectItem value="1">Level 1 (Enhanced)</SelectItem>
                    <SelectItem value="2">Level 2 (Maximum)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {kind === "cert" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Certificate Type</Label>
                <Input
                  id="type"
                  required
                  onChange={(e) => updateField("type", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fields">Fields (JSON)</Label>
                <Textarea
                  id="fields"
                  placeholder="{}"
                  className="font-mono"
                  onChange={(e) => updateField("fieldsJSON", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iconURL">Icon URL</Label>
            <Input
              id="iconURL"
              type="url"
              onChange={(e) => updateField("iconURL", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentationURL">Documentation URL</Label>
            <Input
              id="documentationURL"
              type="url"
              onChange={(e) => updateField("documentationURL", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
