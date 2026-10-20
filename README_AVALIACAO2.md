# EcoPoints — Segunda avaliação (20/10/2026)

## O que foi adicionado
- **Bottom Tabs**: Início, Coletas, Vouchers e Impacto; **Stack**: Login, abas e Detalhes do ponto.
- **GPS nativo** (`expo-location`): solicita permissão e mostra coordenadas aproximadas. **Não calcula distância dos pontos**, pois são dados fictícios.
- **Impacto ambiental**: painel com indicadores e gráfico ilustrativos.
- **Detalhes do ponto**: nova tela acessada pela listagem.
- **FlatList**: já existia no projeto original nas telas Coletas e Vouchers; foi preservada.
- **Paleta EcoFriendly**: atualizada no arquivo `src/theme/colors.js`.

## Instalação e execução
1. Descompacte o projeto.
2. Execute `npm install` (precisa de internet para obter dependências).
3. Execute `npx expo start -c`.
4. Abra no Expo Go compatível com o SDK do projeto, ou em um emulador compatível.

**Atenção:** projeto original usa Expo SDK 51, antigo. Não foi migrado para evitar quebrar a entrega; se o Expo Go atual recusar o SDK, será preciso atualizar o Expo ou usar uma versão compatível no Android. Não há backend nem autenticação real.

## Roteiro para explicar
1. **AppNavigator.js**: Stack gerencia Login/Aplicativo/Detalhes; Tabs alternam áreas principais.
2. **CollectionPointsScreen.js**: `FlatList` apresenta pontos, `useMemo` filtra e `expo-location` pede permissão do GPS.
3. **ImpactScreen.js**: `stats.map` gera cartões e `months.map` cria barras ilustrativas.
4. **PointDetailsScreen.js**: recebe `route.params.point` da lista e mostra os detalhes.
5. **colors.js**: centraliza as cores para manter o design consistente.

## Checklist de demonstração
- [ ] Abrir Login e testar e-mail inválido e senha curta.
- [ ] Entrar e alternar entre as quatro abas.
- [ ] Buscar material na lista de pontos (`FlatList`).
- [ ] Abrir detalhes e voltar.
- [ ] Permitir GPS e mostrar retorno; explicar que locais são fictícios.
- [ ] Abrir Vouchers e demonstrar alteração de status (somente memória).
- [ ] Abrir Impacto e explicar os dados simulados.
- [ ] Mostrar o código das funcionalidades acima.

## Limitações honestas
- Nenhuma integração real com máquina, mapa de estabelecimentos ou backend.
- Saldo, vouchers e indicadores são demonstrações; o resgate não é persistido após reiniciar.
- O GPS funciona de verdade quando permitido, mas não determina quais pontos são próximos.
- EAS Update não foi configurado/publicado.
