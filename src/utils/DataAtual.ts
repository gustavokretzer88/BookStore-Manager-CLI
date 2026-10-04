export function dataAtual(): string {
  return new Date().toISOString().slice(0, 10);
}
