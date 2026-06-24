// types/integration.types.ts
export interface Integracion {
  id: string;
  tiendaId: string;
  tipo: TipoIntegracion;
  activo: boolean;
  configuracion: any;
  createdAt: Date;
  updatedAt: Date;
}

export type TipoIntegracion =
  | "INSTAGRAM_SHOPPING"
  | "GOOGLE_SHOPPING"
  | "WHATSAPP"
  | "MERCADO_PAGO"
  | "STRIPE";

export interface IntegracionWhatsApp {
  numero: string;
  mensajePredeterminado: string;
}

export interface IntegracionInstagram {
  accessToken: string;
  businessId: string;
}

export interface IntegracionGoogleShopping {
  merchantId: string;
  apiKey: string;
}

export interface IntegracionMercadoPago {
  accessToken: string;
  publicKey: string;
}

export interface IntegracionStripe {
  secretKey: string;
  publishableKey: string;
}
