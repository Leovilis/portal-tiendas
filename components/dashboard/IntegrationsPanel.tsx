// src/components/dashboard/IntegrationsPanel.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Zap,
  Check,
  X,
} from "lucide-react";
import {
  SiInstagram,
} from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  configured: boolean;
  configFields?: { key: string; label: string; type: string }[];
}

interface IntegrationsPanelProps {
  tiendaId: string;
  className?: string;
}

export function IntegrationsPanel({
  tiendaId,
  className,
}: IntegrationsPanelProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "instagram",
      name: "Instagram Shopping",
      description: "Muestra tus productos en Instagram",
      icon: <SiInstagram className="h-5 w-5" />,
      active: false,
      configured: false,
      configFields: [
        { key: "instagram_token", label: "Token de acceso", type: "password" },
      ],
    },
    {
      id: "google_shopping",
      name: "Google Shopping",
      description: "Aparece en los resultados de búsqueda de Google",
      icon: <ShoppingBag className="h-5 w-5" />,
      active: false,
      configured: false,
      configFields: [
        { key: "google_token", label: "Token de Google", type: "password" },
        { key: "google_merchant_id", label: "ID de Merchant", type: "text" },
      ],
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Atención al cliente en tiempo real",
      icon: <MessageCircle className="h-5 w-5" />,
      active: false,
      configured: false,
      configFields: [
        { key: "whatsapp_number", label: "Número de WhatsApp", type: "tel" },
      ],
    },
    {
      id: "mercado_pago",
      name: "Mercado Pago",
      description: "Acepta pagos con Mercado Pago",
      icon: <CreditCard className="h-5 w-5" />,
      active: false,
      configured: false,
      configFields: [
        { key: "mp_public_key", label: "Public Key", type: "password" },
        { key: "mp_access_token", label: "Access Token", type: "password" },
      ],
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Acepta pagos con tarjeta de crédito",
      icon: <Zap className="h-5 w-5" />,
      active: false,
      configured: false,
      configFields: [
        {
          key: "stripe_publishable_key",
          label: "Publishable Key",
          type: "password",
        },
        { key: "stripe_secret_key", label: "Secret Key", type: "password" },
      ],
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, active: !integration.active }
          : integration,
      ),
    );
  };

  const saveIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, configured: true }
          : integration,
      ),
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold">Integraciones</h2>
        <p className="text-muted-foreground">
          Conecta tu tienda con los principales canales de venta
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {integration.name}
                    </CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <Switch
                  checked={integration.active}
                  onCheckedChange={() => toggleIntegration(integration.id)}
                  disabled={!integration.configured}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {!integration.configured ? (
                <div className="space-y-3">
                  {integration.configFields?.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        type={field.type}
                        placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => saveIntegration(integration.id)}
                    className="w-full"
                  >
                    Configurar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Configurado</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIntegrations((prev) =>
                        prev.map((integration) =>
                          integration.id === integration.id
                            ? {
                                ...integration,
                                configured: false,
                                active: false,
                              }
                            : integration,
                        ),
                      );
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
