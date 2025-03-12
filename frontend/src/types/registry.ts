
export type RegistryKind = 'basket' | 'proto' | 'cert';

export interface BaseRegistryRecord {
  name: string;
  iconURL: string;
  description: string;
  documentationURL: string;
  txid: string;
  vout: number;
}

export interface BasketRecord extends BaseRegistryRecord {
  kind: 'basket';
  basketID: string;
}

export interface ProtocolRecord extends BaseRegistryRecord {
  kind: 'proto';
  protocolID: string;
  securityLevel: 0 | 1 | 2;
}

export interface CertificateRecord extends BaseRegistryRecord {
  kind: 'cert';
  type: string;
  fields?: Record<string, unknown>;
}

export type RegistryRecord = BasketRecord | ProtocolRecord | CertificateRecord;
