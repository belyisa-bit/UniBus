// Execute na raiz do frontend: node scripts/exportar-dados-demo.mjs
// Snapshot para o perfil local do backend; horários em dias úteis são demonstrativos.
import { writeFileSync } from 'node:fs'
import { linhas } from '../src/data/linhas.js'
import { pontosEmbarquePorCidade } from '../src/data/pontosEmbarque.js'

const destino = new URL('../../unibus-backend/src/main/resources/demo/linhas.json', import.meta.url)
writeFileSync(destino, JSON.stringify(linhas.map(linha => ({
  ...linha,
  pontosEmbarque: pontosEmbarquePorCidade[linha.origem] || [],
})), null, 2) + '\n')
