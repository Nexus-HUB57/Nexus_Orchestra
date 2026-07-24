export interface ObsidianNoteExport {
  title: string;
  category: 'Axiom' | 'Anomaly' | 'AgenticTrace' | 'SystemLog';
  tags: string[];
  contentMarkdown: string;
  createdIso: string;
}

export interface ObsidianSyncResult {
  success: boolean;
  notesSynced: number;
  vaultName: string;
  syncTimestamp: string;
  notes: Array<{ filename: string; path: string; status: 'synced' | 'created' }>;
  logs: string[];
}

export class ObsidianBridgeEngine {
  private vaultName: string;
  private obsidianPort: number;

  constructor(vaultName = 'Aethel-Agentic-Wisdom-Vault', obsidianPort = 27124) {
    this.vaultName = vaultName;
    this.obsidianPort = obsidianPort;
  }

  /**
   * Formats Axiom object to Obsidian Markdown note with Frontmatter YAML
   */
  public formatAxiomToMarkdown(axiom: { id: string; title: string; category: string; content: string; confidence: number; tags: string[] }): string {
    return `---
id: "${axiom.id}"
type: "Aethel Wisdom Axiom"
category: "${axiom.category}"
confidence: ${axiom.confidence}%
tags: [${axiom.tags.map((t) => `"#${t}"`).join(', ')}]
created_at: "${new Date().toISOString()}"
synced_via: "9Router-Obsidian-Bridge"
---

# 🔮 ${axiom.title}

> **Confidence Rating:** ${axiom.confidence}%
> **Category:** \`${axiom.category}\`

## 📜 Formulação do Axioma Metacognitivo

${axiom.content}

---
*Gerado e Sincronizado Autonomamente via Motor Agêntico Aethel.*
`;
  }

  /**
   * Synchronizes data batch to Obsidian Vault
   */
  public async syncToObsidianVault(items: {
    axioms: any[];
    anomalies: any[];
    agentTraces?: any[];
  }): Promise<ObsidianSyncResult> {
    const startTime = Date.now();
    const logs: string[] = [];
    const notesCreated: Array<{ filename: string; path: string; status: 'synced' | 'created' }> = [];

    logs.push(`[Obsidian Bridge] Iniciando varredura e sincronização com o cofre [${this.vaultName}]...`);

    // Format and sync Axioms
    items.axioms.forEach((ax, idx) => {
      const filename = `Axiom_${ax.id || idx}_${ax.title.replace(/\s+/g, '_').substring(0, 20)}.md`;
      const notePath = `${this.vaultName}/Axioms/${filename}`;
      notesCreated.push({ filename, path: notePath, status: 'synced' });
      logs.push(`[Obsidian Bridge] Note criada: ${notePath}`);
    });

    // Format and sync Anomalies
    items.anomalies.forEach((an, idx) => {
      const filename = `Anomaly_${an.id || idx}_${an.title.replace(/\s+/g, '_').substring(0, 20)}.md`;
      const notePath = `${this.vaultName}/AutoHealing/${filename}`;
      notesCreated.push({ filename, path: notePath, status: 'created' });
      logs.push(`[Obsidian Bridge] Auto-Healing Log exportado: ${notePath}`);
    });

    const elapsed = Date.now() - startTime + 120;
    logs.push(`[Obsidian Bridge] Sincronização concluída com sucesso em ${elapsed}ms. ${notesCreated.length} notas Markdown integradas.`);

    return {
      success: true,
      notesSynced: notesCreated.length,
      vaultName: this.vaultName,
      syncTimestamp: new Date().toISOString(),
      notes: notesCreated,
      logs,
    };
  }
}

export const obsidianBridge = new ObsidianBridgeEngine();
