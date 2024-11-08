# Teste de Performance com JMeter em um E-commerce de Roupas

Este projeto utiliza o **JMeter** para realizar testes de performance em um site de e-commerce simulado de uma loja de roupas. O objetivo é avaliar a resposta do sistema em diferentes cenários de carga, identificando possíveis gargalos e melhorias no desempenho da aplicação.

## Requisitos

Para rodar o JMeter, é necessário ter o **Java** instalado. Faça o download das ferramentas:

- [Download do Java](https://www.oracle.com/java/technologies/javase-downloads.html)
- [Download do JMeter](https://jmeter.apache.org/download_jmeter.cgi)

## Site de Teste

Este projeto realiza requisições de teste para o site de e-commerce simulado [Automation Practice](http://www.automationpractice.pl/index.php), que simula um ambiente de loja de roupas online.

---

## Cenários de Teste

Este projeto contempla três cenários principais de teste de usuários:

1. **Cenário de Teste 1: Usuário Navegador**
    - Abrir página inicial (home)
    - Acessar categorias de produtos
    - Visualizar produtos

2. **Cenário de Teste 2: Usuário Buscador**
    - Abrir página inicial (home)
    - Realizar busca com palavras-chave específicas ("shirt" e "dress")
    - Abrir detalhes de um produto retornado na busca

3. **Cenário de Teste 3: Usuário Comprador**
    - Abrir página inicial (home)
    - Realizar login
    - Abrir página inicial novamente (logado)
    - Escolher um produto
    - Adicionar o produto ao carrinho
    - Iniciar processo de compra
    - Etapa 1 da compra: confirmar endereço
    - Etapa 2 da compra: aceitar termos de uso
    - Etapa 3 da compra: escolher forma de pagamento
    - Etapa 4 da compra: finalizar compra
    - Visualizar ordem de compra

## Execução dos Testes e Geração de Dashboards

1. Abra o JMeter e importe o plano de teste.
2. Execute o plano e monitore os gráficos e resultados em tempo real ou exporte os dados ao final.
3. Execute por linha de comando dentro da pasta do projeto: 
   - `C:\{caminho dos arquivos Jmeter}\bin\jmeter.bat -n -t eCommerce.jmx -l resultado.csv -e -o eCommerceDashboard`
4. Verifique os resultados gerados na pasta `eCommerceDashboard` para análise detalhada.

## Análise dos Resultados

Os resultados dos testes de performance são analisados com base nas seguintes métricas principais:
- **Tempo de resposta médio**: Mede a rapidez do sistema ao responder às requisições.
- **Taxa de erro**: Indica a porcentagem de requisições com falhas.
- **Throughput (Transações por segundo)**: Avalia o volume de requisições processadas por segundo, um bom indicativo da capacidade do sistema.

