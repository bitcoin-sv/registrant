
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
import { Plus, X } from "lucide-react";
import { RegistryKind } from "@/types/registry";

interface RegistryFormProps {
  kind: RegistryKind;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}

interface CertField {
  key: string;
  value: string;
}

export const RegistryForm = ({
  kind,
  open,
  onClose,
  onSubmit,
}: RegistryFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certFields, setCertFields] = useState<CertField[]>([]);

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
      if (kind === "cert") {
        const fieldsObj = certFields.reduce((acc, field) => {
          if (field.key && field.value) {
            acc[field.key] = field.value;
          }
          return acc;
        }, {} as Record<string, string>);

        await onSubmit({
          ...formData,
          fieldsJSON: JSON.stringify(fieldsObj),
        });
      } else {
        await onSubmit(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCertField = () => {
    setCertFields(prev => [...prev, { key: "", value: "" }]);
  };

  const removeCertField = (index: number) => {
    setCertFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateCertField = (index: number, key: string, value: string) => {
    setCertFields(prev =>
      prev.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      )
    );
  };

  useEffect(() => {
    if (open) {
      setFormData({});
      setCertFields([]);
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
                <div className="flex justify-between items-center mb-2">
                  <Label>Certificate Fields</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCertField}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </Button>
                </div>
                <div className="space-y-3">
                  {certFields.map((field, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Input
                        placeholder="Field name"
                        value={field.key}
                        onChange={(e) => updateCertField(index, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Field value"
                        value={field.value}
                        onChange={(e) => updateCertField(index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCertField(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {certFields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No fields added yet. Click "Add Field" to start adding certificate fields.
                    </p>
                  )}
                </div>
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
