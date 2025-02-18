
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RegistryRecord } from "@/types/registry";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegistryCardProps {
  item: RegistryRecord;
  onRevoke: () => void;
}

export const RegistryCard = ({ item, onRevoke }: RegistryCardProps) => {
  const getTitle = () => {
    if ('basketID' in item) return `Basket: ${item.basketID}`;
    if ('protocolID' in item) return `Protocol: ${item.protocolID}`;
    return `Certificate: ${item.type}`;
  };

  const getSecurityBadge = () => {
    if ('securityLevel' in item) {
      const level = item.securityLevel;
      return (
        <Badge
          className={cn(
            "ml-2",
            level === 0 && "bg-yellow-500",
            level === 1 && "bg-blue-500",
            level === 2 && "bg-green-500"
          )}
        >
          Security Level {level}
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="w-full p-4 sm:p-6 backdrop-blur-sm bg-white/50 dark:bg-black/50 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-semibold break-all">
            {getTitle()}
            {getSecurityBadge()}
          </h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 self-end sm:self-start"
          onClick={onRevoke}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Name:</span> {item.name}
        </p>
        {item.documentationURL && (
          <p className="text-sm break-all">
            <span className="font-medium">Documentation:</span>{" "}
            <a
              href={item.documentationURL}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Documentation
            </a>
          </p>
        )}
        {'fields' in item && item.fields && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Fields:</h4>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              {JSON.stringify(item.fields, null, 2)}
            </pre>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-4 break-all">
          TXID: {item.txid} • vout: {item.vout}
        </p>
      </div>
    </Card>
  );
};