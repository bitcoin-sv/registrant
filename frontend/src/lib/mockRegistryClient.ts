
import { RegistryKind, RegistryRecord } from '@/types/registry';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockRegistryClient {
  private items: RegistryRecord[] = [];

  async registerItem(item: Partial<RegistryRecord>) {
    await delay(800); // Simulate network delay
    const newItem = {
      ...item,
      txid: Math.random().toString(36).substring(7),
      vout: Math.floor(Math.random() * 100),
    } as RegistryRecord;
    
    this.items.push(newItem);
    return newItem;
  }

  async listOwnRegistryEntries(kind: RegistryKind) {
    await delay(500);
    return this.items.filter(item => 'kind' in item && item.kind === kind);
  }

  async revokeOwnRegistryEntry(kind: RegistryKind, entry: RegistryRecord) {
    await delay(600);
    this.items = this.items.filter(item => item.txid !== entry.txid);
  }
}
